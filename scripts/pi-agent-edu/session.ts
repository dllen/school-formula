/**
 * Interactive session wrapper for pi-agent-edu.
 *
 * Wraps the pi coding-agent SDK's AgentSession (when available) or provides
 * an inline implementation with the same tool call interception API.
 *
 * SDK API (packages/coding-agent/src/core/agent-session.ts):
 *   const { session } = await createAgentSession({ customTools, ... });
 *   await session.prompt(text);          // send message, tool calls fire events
 *   session.abort();                     // cancel current run
 *   session.subscribe(listener);         // AgentSessionEvent → void
 *   session.getTools();                  // Tool[]
 *
 * AgentSessionEvent types:
 *   tool_call       → { type, tool, toolCallId, input }
 *   tool_result     → { type, toolCallId, result }
 *   agent_start     → { type }
 *   agent_end       → { type, reason }
 */

import { EventEmitter } from "node:events";
import type { Config } from "./config.js";
import { toolConfirm } from "./io.js";
import { createTools, type ToolInfo } from "./tools.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A tool call as emitted by the session */
export interface SessionToolCall {
	toolCallId: string;
	tool: string;
	args: Record<string, unknown>;
}

/** How the user responded to a tool call */
export type ToolCallResponse = "execute" | "skip" | "abort" | "always" | "never";

/** Event emitted during a session prompt */
export type SessionEvent =
	| { type: "tool_call"; call: SessionToolCall }
	| { type: "tool_result"; toolCallId: string; result: string }
	| { type: "agent_thinking"; text: string }
	| { type: "agent_speaking"; text: string }
	| { type: "error"; error: string };

/** Listener for session events */
export type SessionEventListener = (event: SessionEvent) => void;

/** Result of a prompt call */
export interface PromptResult {
	response: string;
	toolCalls: SessionToolCall[];
}

// ---------------------------------------------------------------------------
// Inline session implementation
//
// When the pi SDK monorepo is built, replace InlineAgentSession with:
//   import { AgentSession } from '/path/to/sdk';
// ---------------------------------------------------------------------------

class InlineAgentSession {
	private tools: ToolInfo[];
	private emitter = new EventEmitter();
	private abortFlag = false;

	constructor(toolInfos: ToolInfo[]) {
		this.tools = toolInfos;
	}

	setToolAutoApprove(autoApproveTools: string[]): void {
		// store for later use in interceptToolCall
		this._autoApproveTools = autoApproveTools;
	}

	private _autoApproveTools: string[] = [];

	subscribe(listener: SessionEventListener): () => void {
		this.emitter.on("session", listener);
		return () => this.emitter.off("session", listener);
	}

	async prompt(text: string): Promise<void> {
		this.abortFlag = false;
		this.emitter.emit("session", { type: "agent_speaking", text: `[assistant] ${text}` });
	}

	abort(): void {
		this.abortFlag = true;
	}

	getTools() {
		return this.tools.map((t) => t.definition);
	}

	private async interceptToolCall(call: SessionToolCall): Promise<{ result: string; response: ToolCallResponse }> {
		const toolInfo = this.tools.find((t) => t.definition.name === call.tool);
		if (!toolInfo) {
			return { result: `Unknown tool: ${call.tool}`, response: "skip" };
		}

		// auto-approve matching tools
		if (this._autoApproveTools.includes(call.tool)) {
			try {
				const result = await toolInfo.definition.execute(call.toolCallId, call.args);
				const text = result.content.map((c) => c.text).join("\n");
				return { result: text, response: "always" };
			} catch (e: unknown) {
				return { result: `Error: ${String(e)}`, response: "skip" };
			}
		}

		// ask the user
		const response = await toolConfirm(call.tool, call.args);
		switch (response) {
			case "y":
				try {
					const result = await toolInfo.definition.execute(call.toolCallId, call.args);
					const text = result.content.map((c) => c.text).join("\n");
					return { result: text, response: "execute" };
				} catch (e: unknown) {
					return { result: `Error: ${String(e)}`, response: "skip" };
				}
			case "a":
				this._autoApproveTools.push(call.tool);
				try {
					const result = await toolInfo.definition.execute(call.toolCallId, call.args);
					const text = result.content.map((c) => c.text).join("\n");
					return { result: text, response: "always" };
				} catch (e: unknown) {
					return { result: `Error: ${String(e)}`, response: "skip" };
				}
			case "b":
				this._autoApproveTools.push(call.tool);
				return { result: "(skipped by user)", response: "never" };
			case "n":
				return { result: "(skipped by user)", response: "skip" };
			case "q":
				this.abort();
				return { result: "(aborted)", response: "abort" };
			default:
				return { result: "(invalid response, skipping)", response: "skip" };
		}
	}
}

// ---------------------------------------------------------------------------
// InteractiveSession — public API
// ---------------------------------------------------------------------------

/**
 * Interactive session wrapper.
 *
 * Wraps an AgentSession (SDK or inline) with:
 * - Tool call interception (y/n/q/a/b via io.toolConfirm)
 * - Auto-approve list from config
 * - Event subscription for session events
 *
 * Designed to be swapped for the real pi SDK AgentSession when the
 * monorepo is built, with zero API changes for consumers.
 */
export class InteractiveSession {
	private _session: InlineAgentSession;
	private _sessionId: string;
	private _tools: ToolInfo[];
	private _eventListeners: Set<SessionEventListener> = new Set();

	constructor(config: Config, sessionId: string) {
		this._sessionId = sessionId;
		this._tools = createTools();

		// Use inline implementation for now
		// TODO: replace with SDK AgentSession when monorepo is built:
		//   const { session } = await createAgentSession({
		//     customTools: this._tools.map(t => t.definition),
		//     autoApproveTools: config.autoApproveTools,
		//   });
		this._session = new InlineAgentSession(this._tools);
		this._session.setToolAutoApprove(config.autoApproveTools);

		// Forward session events to our listeners
		this._session.subscribe((event) => {
			this._eventListeners.forEach((fn) => fn(event));
		});
	}

	/**
	 * Send a message to the agent and wait for a response.
	 *
	 * In inline mode: echoes the message back as a simulation.
	 * When using the SDK: delegates to AgentSession.prompt().
	 *
	 * @param message  The user message to send
	 * @returns The agent's response text
	 */
	async prompt(message: string): Promise<string> {
		await this._session.prompt(message);
		return `[inline session ${this._sessionId}] acknowledged: ${message}`;
	}

	/** Unique identifier for this session */
	getSessionId(): string {
		return this._sessionId;
	}

	/** Abort the currently running prompt (if any) */
	abort(): void {
		this._session.abort();
	}

	/**
	 * Subscribe to session events.
	 *
	 * Events:
	 *   tool_call        → user can intercept with y/n/q/a/b
	 *   tool_result      → raw result text from tool
	 *   agent_thinking  → model is thinking
	 *   agent_speaking  → model output
	 *   error           → something went wrong
	 *
	 * @returns Unsubscribe function
	 */
	subscribe(listener: SessionEventListener): () => void {
		this._eventListeners.add(listener);
		return () => this._eventListeners.delete(listener);
	}
}
