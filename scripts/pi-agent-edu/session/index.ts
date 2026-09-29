/**
 * session/ — public barrel for the interactive session module.
 *
 * Re-exports the InteractiveSession class plus the event/option types used by
 * external callers (CLI entry, wizard). Internal helpers (DIM, summarize) are
 * deliberately not re-exported — they are implementation details.
 */

export type { SessionEvent, SessionEventListener, SessionCreateOptions } from './types.js';
export type { ThinkingLevel } from '../config.js';
export { InteractiveSession } from './class.js';
