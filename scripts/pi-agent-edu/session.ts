/**
 * Interactive session wrapper for pi-agent-edu.
 *
 * Uses the local `pi` CLI subprocess for agent interactions.
 * The `pi` CLI must be installed and available in PATH.
 */

import { exec, type ChildProcess } from "node:child_process";
import { print } from "./io.js";
import type { Config } from "./config.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Event emitted during a session prompt */
export type SessionEvent =
	| { type: "thinking"; text: string }
	| { type: "speaking"; text: string }
	| { type: "tool_call"; tool: string; args: Record<string, unknown> }
	| { type: "tool_result"; tool: string; result: string }
	| { type: "error"; error: string };

/** Listener for session events */
export type SessionEventListener = (event: SessionEvent) => void;

// ---------------------------------------------------------------------------
// PiSession - wraps `pi --print --continue` subprocess
// ---------------------------------------------------------------------------

class PiSession {
	private config: Config;
	private sessionId: string;
	private eventListeners = new Set<SessionEventListener>();
	private currentProcess: ChildProcess | null = null;

	constructor(config: Config, sessionId: string) {
		this.config = config;
		this.sessionId = sessionId;
	}

	subscribe(listener: SessionEventListener): () => void {
		this.eventListeners.add(listener);
		return () => this.eventListeners.delete(listener);
	}

	abort(): void {
		if (this.currentProcess) {
			this.currentProcess.kill();
			this.currentProcess = null;
		}
	}

	/**
	 * Send a message to the pi agent.
	 * Uses streaming output to show thinking and speaking in real-time.
	 */
	async prompt(message: string): Promise<string> {
		const escapedMsg = message.replace(/"/g, '\\"');
		const cmd = `${this.config.piPath} --provider ${this.config.provider} -ne --print --continue "${this.sessionId}" -- "${escapedMsg}"`;

		print('\n🤔 思考中...\n', 'thinking');

		return new Promise((resolve, reject) => {
			const chunks: string[] = [];

			this.currentProcess = exec(cmd, {
				cwd: this.config.projectRoot,
				timeout: 300_000,
			});

			const proc = this.currentProcess;

			// Process stdout - contains thinking and response
			proc.stdout?.on('data', (data: Buffer) => {
				const text = data.toString();
				chunks.push(text);

				// Check for API errors in response
				if (text.includes('permission_error') || text.includes('quota') || text.includes('403') || text.includes('402')) {
					this.emit({ type: 'error', error: 'API 配额不足，请充值或更换 Provider' });
					proc.kill();
					return;
				}

				// Parse and emit events based on content
				const lines = text.split('\n');
				for (const line of lines) {
					if (line.includes('[TOOL_CALL]') || line.includes('Calling tool:')) {
						// Extract tool info
						const match = line.match(/(?:Calling tool:|Tool:)\s*(\w+)/i);
						if (match) {
							this.emit({ type: 'tool_call', tool: match[1], args: {} });
						}
					} else if (line.trim()) {
						// Regular output
						this.emit({ type: 'speaking', text: line });
					}
				}
			});

			// Process stderr - errors and debug info
			proc.stderr?.on('data', (data: Buffer) => {
				const text = data.toString().trim();
				if (text) {
					// Check for API errors
					if (text.includes('permission_error') || text.includes('quota') || text.includes('403')) {
						this.emit({ type: 'error', error: 'API 配额不足，请充值或更换 Provider' });
					} else if (text.includes('401') || text.includes('unauthorized')) {
						this.emit({ type: 'error', error: 'API 认证失败，请检查 API Key' });
					} else if (text.includes('thinking') || text.includes('analyzing') || text.includes('planning')) {
						this.emit({ type: 'thinking', text });
					}
				}
			});

			proc.on('close', (code) => {
				this.currentProcess = null;
				const fullOutput = chunks.join('');
				if (code === 0 || chunks.length > 0) {
					resolve(fullOutput.trim());
				} else {
					reject(new Error(`pi exited with code ${code}`));
				}
			});

			proc.on('error', (err) => {
				this.currentProcess = null;
				this.emit({ type: 'error', error: err.message });
				reject(err);
			});
		});
	}

	private emit(event: SessionEvent): void {
		// Also print to console for visibility
		switch (event.type) {
			case 'thinking':
				if (event.text) print(event.text, 'dim');
				break;
			case 'speaking':
				if (event.text) process.stdout.write(event.text + '\n');
				break;
			case 'tool_call':
				print(`\n🔧 使用工具: ${event.tool}`, 'info');
				break;
			case 'tool_result':
				print(`  → ${event.result.slice(0, 100)}${event.result.length > 100 ? '...' : ''}`, 'dim');
				break;
			case 'error':
				print(`❌ 错误: ${event.error}`, 'error');
				break;
		}

		this.eventListeners.forEach((fn) => fn(event));
	}
}

// ---------------------------------------------------------------------------
// InteractiveSession — public API
// ---------------------------------------------------------------------------

/**
 * Interactive session wrapper for pi agent.
 *
 * Wraps the `pi` CLI subprocess with:
 * - Session persistence via `pi --continue`
 * - Streaming output for real-time feedback
 * - Event subscription for session events
 */
export class InteractiveSession {
	private _pi: PiSession;
	private _sessionId: string;

	constructor(config: Config, sessionId: string) {
		this._pi = new PiSession(config, sessionId);
		this._sessionId = sessionId;
	}

	async prompt(message: string): Promise<string> {
		return this._pi.prompt(message);
	}

	getSessionId(): string {
		return this._sessionId;
	}

	abort(): void {
		this._pi.abort();
	}

	subscribe(listener: SessionEventListener): () => void {
		return this._pi.subscribe(listener);
	}
}
