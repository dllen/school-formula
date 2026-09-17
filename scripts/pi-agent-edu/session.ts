/**
 * Interactive session wrapper for pi-agent-edu.
 *
 * Uses the local `pi` CLI subprocess for agent interactions.
 * The `pi` CLI must be installed and available in PATH.
 */

import { execSync, exec, type ExecSyncOptions } from "node:child_process";
import { print } from "./io.js";
import type { Config } from "./config.js";
import { toolConfirm } from "./io.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A tool call as emitted by the session */
export interface SessionToolCall {
	toolCallId: string;
	tool: string;
	args: Record<string, unknown>;
}

/** Event emitted during a session prompt */
export type SessionEvent =
	| { type: "tool_call"; call: SessionToolCall }
	| { type: "tool_result"; toolCallId: string; result: string }
	| { type: "agent_thinking"; text: string }
	| { type: "agent_speaking"; text: string }
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

	constructor(config: Config, sessionId: string) {
		this.config = config;
		this.sessionId = sessionId;
	}

	subscribe(listener: SessionEventListener): () => void {
		this.eventListeners.add(listener);
		return () => this.eventListeners.delete(listener);
	}

	abort(): void {
		// pi doesn't support abort via CLI, just exit
		process.exit(1);
	}

	/**
	 * Send a message to the pi agent.
	 * Uses `pi --print` for non-interactive output mode.
	 */
	async prompt(message: string): Promise<string> {
		const escapedMsg = message.replace(/"/g, '\\"');
		const cmd = `${this.config.piPath} --provider ${this.config.provider} -ne --print --continue "${this.sessionId}" -- "${escapedMsg}"`;

		const opts: ExecSyncOptions = {
			cwd: this.config.projectRoot,
			encoding: "utf-8",
			stdio: ["pipe", "pipe", "pipe"],
			timeout: 300_000, // 5 min timeout
		};

		try {
			const output = execSync(cmd, opts);
			const text = typeof output === 'string' ? output : output.toString('utf-8');
			return text.trim();
		} catch (err: unknown) {
			const error = err as Error & { status?: number; stdout?: string; stderr?: string };
			// Non-zero exit: return partial output if available
			const stdout = error.stdout != null ? String(error.stdout) : '';
			const stderr = error.stderr != null ? String(error.stderr) : '';
			const partial = stdout.trim() || stderr.trim();
			if (partial) {
				return partial;
			}
			// No output: throw original error
			throw new Error(error.message || `pi exited with code ${error.status}`);
		}
	}

	private emit(event: SessionEvent): void {
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
 * - Event subscription for streaming output
 *
 * Usage:
 *   const session = new InteractiveSession(config, sessionId);
 *   session.subscribe((event) => { ... });
 *   const response = await session.prompt("生成初中数学教程");
 */
export class InteractiveSession {
	private _pi: PiSession;
	private _sessionId: string;

	constructor(config: Config, sessionId: string) {
		this._pi = new PiSession(config, sessionId);
		this._sessionId = sessionId;
	}

	/**
	 * Send a message to the agent and wait for a response.
	 *
	 * @param message  The user message to send
	 * @returns The agent's response text
	 */
	async prompt(message: string): Promise<string> {
		return this._pi.prompt(message);
	}

	/** Unique identifier for this session */
	getSessionId(): string {
		return this._sessionId;
	}

	/** Abort the currently running prompt (if any) */
	abort(): void {
		this._pi.abort();
	}

	/**
	 * Subscribe to session events.
	 *
	 * Events:
	 *   tool_call        → tool call from agent
	 *   tool_result      → raw result text from tool
	 *   agent_thinking  → model is thinking
	 *   agent_speaking  → model output
	 *   error           → something went wrong
	 *
	 * @returns Unsubscribe function
	 */
	subscribe(listener: SessionEventListener): () => void {
		return this._pi.subscribe(listener);
	}
}
