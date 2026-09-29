/**
 * Event types and listener contract for InteractiveSession.
 *
 * Kept dependency-free so they can be imported from any layer (tests,
 * wizard, CLI) without pulling in the SDK or class internals.
 */

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
