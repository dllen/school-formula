/**
 * Internal helpers used by InteractiveSession — display + serialization.
 *
 * Not exported from the session/ barrel; these are implementation details.
 */

/** ANSI dim escape for low-emphasis stream output (thinking deltas). */
const DIM = (t: string) => `\x1b[2m${t}\x1b[0m`;

/** Stringify + truncate a tool result for compact display. */
function summarize(result: unknown, max = 200): string {
  const s = typeof result === 'string' ? result : JSON.stringify(result);
  if (s.length <= max) return s;
  return `${s.slice(0, max)}...`;
}

export { DIM, summarize };
