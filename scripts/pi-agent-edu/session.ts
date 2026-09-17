/**
 * Interactive session wrapper for pi-agent-edu.
 *
 * Uses the `@earendil-works/pi-coding-agent` SDK in-process instead of shelling
 * out to the `pi` CLI. The SDK provides structured events for thinking, text,
 * tool calls and errors — no string parsing.
 */

import {
  ModelRuntime,
  SessionManager,
  createAgentSession,
  type AgentSession,
  type AgentSessionEvent,
} from '@earendil-works/pi-coding-agent';
import { print } from './io.js';
import { getAgentDir, type Config, type ThinkingLevel } from './config.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Event emitted during a session prompt */
export type SessionEvent =
  | { type: 'thinking_start' }
  | { type: 'thinking'; text: string }
  | { type: 'thinking_end' }
  | { type: 'speaking'; text: string }
  | { type: 'tool_call'; tool: string; args: Record<string, unknown> }
  | { type: 'tool_result'; tool: string; result: string; isError: boolean }
  | { type: 'error'; error: string };

/** Listener for session events */
export type SessionEventListener = (event: SessionEvent) => void;

/** Options controlling how an InteractiveSession is created. */
export interface SessionCreateOptions {
  /** Continue the most recent session for the project (else start new). */
  continue?: boolean;
  /** Open a specific session file path. Overrides `continue`. */
  sessionPath?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DIM = (t: string) => `\x1b[2m${t}\x1b[0m`;

/** Stringify + truncate a tool result for compact display. */
function summarize(result: unknown, max = 200): string {
  const s = typeof result === 'string' ? result : JSON.stringify(result);
  if (s.length <= max) return s;
  return `${s.slice(0, max)}...`;
}

// ---------------------------------------------------------------------------
// InteractiveSession — public API
// ---------------------------------------------------------------------------

/**
 * Wraps the pi SDK AgentSession with:
 * - Provider/model selection via ModelRuntime
 * - Session persistence via pi's native SessionManager
 * - Structured thinking/text/tool/error event streaming
 */
export class InteractiveSession {
  private session: AgentSession;
  private runtime: ModelRuntime;
  private config: Config;
  private listeners = new Set<SessionEventListener>();
  private textBuffer: string[] = [];

  private constructor(session: AgentSession, runtime: ModelRuntime, config: Config) {
    this.session = session;
    this.runtime = runtime;
    this.config = config;
    session.subscribe(this.handleEvent);
  }

  static async create(
    config: Config,
    runtime: ModelRuntime,
    options: SessionCreateOptions = {},
  ): Promise<InteractiveSession> {
    const agentDir = getAgentDir();

    let sessionManager: SessionManager;
    if (options.sessionPath) {
      sessionManager = SessionManager.open(options.sessionPath, undefined, config.projectRoot);
    } else if (options.continue) {
      sessionManager = SessionManager.continueRecent(config.projectRoot);
    } else {
      sessionManager = SessionManager.create(config.projectRoot);
    }

    const hasModel = config.provider !== '' && config.model !== '';
    const model = hasModel ? runtime.getModel(config.provider, config.model) : undefined;
    if (hasModel && !model) {
      throw new Error(`模型不存在或未配置鉴权: ${config.provider}/${config.model}`);
    }

    const { session } = await createAgentSession({
      cwd: config.projectRoot,
      agentDir,
      modelRuntime: runtime,
      model,
      thinkingLevel: config.thinkingLevel,
      tools: config.tools,
      sessionManager,
    });

    return new InteractiveSession(session, runtime, config);
  }

  /** Send a message to the agent. Streams thinking/text/tools live, returns full text. */
  async prompt(message: string): Promise<string> {
    this.textBuffer = [];
    await this.session.prompt(message);
    return this.textBuffer.join('');
  }

  getSessionId(): string {
    return this.session.sessionId;
  }

  getSessionFile(): string | undefined {
    return this.session.sessionFile;
  }

  async abort(): Promise<void> {
    await this.session.abort();
  }

  /** Switch the active model (persists to the session transcript). */
  async setModel(provider: string, modelId: string): Promise<void> {
    const model = this.runtime.getModel(provider, modelId);
    if (!model) throw new Error(`模型不存在或未配置鉴权: ${provider}/${modelId}`);
    await this.session.setModel(model);
    this.config.provider = provider;
    this.config.model = modelId;
  }

  getThinkingLevel(): ThinkingLevel {
    return this.session.thinkingLevel;
  }

  setThinkingLevel(level: ThinkingLevel): void {
    this.session.setThinkingLevel(level);
    this.config.thinkingLevel = level;
  }

  cycleThinkingLevel(): ThinkingLevel | undefined {
    return this.session.cycleThinkingLevel();
  }

  subscribe(listener: SessionEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // -------------------------------------------------------------------------
  // SDK event mapping
  // -------------------------------------------------------------------------

  private handleEvent = (event: AgentSessionEvent): void => {
    switch (event.type) {
      case 'message_update':
        this.handleAssistantEvent(event.assistantMessageEvent);
        break;

      case 'tool_execution_start':
        this.emit({ type: 'tool_call', tool: event.toolName, args: event.args ?? {} });
        break;

      case 'tool_execution_end':
        this.emit({
          type: 'tool_result',
          tool: event.toolName,
          result: summarize(event.result),
          isError: event.isError,
        });
        if (event.isError) {
          this.emit({ type: 'error', error: `工具 ${event.toolName} 执行失败` });
        }
        break;

      case 'message_end': {
        const msg = event.message;
        if (msg.role === 'assistant' && msg.stopReason === 'error' && msg.errorMessage) {
          this.emit({ type: 'error', error: msg.errorMessage });
        }
        break;
      }

      case 'auto_retry_start':
        print(`⚠️ 请求失败，自动重试 (第 ${event.attempt}/${event.maxAttempts} 次)`, 'warn');
        break;

      case 'auto_retry_end':
        if (!event.success && event.finalError) {
          this.emit({ type: 'error', error: event.finalError });
        }
        break;

      case 'compaction_end':
        if (event.errorMessage) {
          this.emit({ type: 'error', error: event.errorMessage });
        }
        break;

      default:
        break;
    }
  };

  private handleAssistantEvent(e: { type: string; delta?: string }): void {
    switch (e.type) {
      case 'thinking_start':
        this.emit({ type: 'thinking_start' });
        break;
      case 'thinking_delta':
        if (e.delta) this.emit({ type: 'thinking', text: e.delta });
        break;
      case 'thinking_end':
        this.emit({ type: 'thinking_end' });
        break;
      case 'text_delta':
        if (e.delta) {
          this.textBuffer.push(e.delta);
          this.emit({ type: 'speaking', text: e.delta });
        }
        break;
      default:
        break;
    }
  }

  private emit(event: SessionEvent): void {
    // Render to console for visibility
    switch (event.type) {
      case 'thinking_start':
        print('\n🤔 思考中…', 'thinking');
        break;
      case 'thinking':
        process.stdout.write(DIM(event.text));
        break;
      case 'thinking_end':
        process.stdout.write('\n');
        break;
      case 'speaking':
        process.stdout.write(event.text);
        break;
      case 'tool_call':
        print(`\n🔧 使用工具: ${event.tool}`, 'info');
        break;
      case 'tool_result':
        if (event.isError) {
          print(`  ❌ ${event.result}`, 'error');
        } else {
          print(`  → ${event.result}`, 'dim');
        }
        break;
      case 'error':
        print(`❌ 错误: ${event.error}`, 'error');
        break;
    }

    this.listeners.forEach((fn) => fn(event));
  }
}
