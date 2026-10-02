import { REFERENCE_SLUGS } from './data/reference';
import { EN, homePath } from './i18n/languages';

/**
 * The English surface's route table — the single place the router, the prerender/sitemap
 * route list and the link helpers all read. Mirrors `src/view-routes.ts` for the Chinese app.
 */

/** Canonical home of the English surface; also the language entry point's target. */
export const ENGLISH_HOME = homePath(EN);

/** React Router pattern for a single reference chart. */
export const ENGLISH_REFERENCE_ROUTE = `${ENGLISH_HOME}reference/:slug`;

/** Canonical path of a reference chart. */
export function referencePath(slug: string): string {
  return `${ENGLISH_HOME}reference/${slug}/`;
}

/** Slug of a chart from its language-stripped path (`/reference/x`), or null. */
export function referenceSlugForAppPath(appPath: string): string | null {
  const match = /^\/reference\/([^/]+)\/?$/.exec(appPath);
  return match ? match[1] : null;
}

/** Every English route path, in the shape the prerender list and sitemap use. */
export const ENGLISH_ROUTE_PATHS: string[] = [ENGLISH_HOME, ...REFERENCE_SLUGS.map(referencePath)];
