import { run } from './prerender/run';

/**
 * The SSR entry.
 *
 * This file must export nothing: any export here becomes part of the entry
 * chunk that the lazily-imported route chunks import back into, and a
 * top-level `await` in an entry chunk deadlocks those imports (see the note
 * in ./prerender/run.ts). The work itself lives in ./prerender/run.ts.
 */
run().catch((error) => {
  console.error('prerender failed:', error);
  process.exitCode = 1;
});
