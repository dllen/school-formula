/**
 * Cache-Control strategy for the Worker edge.
 *
 * The Worker serves prerendered HTML from `dist/` plus hashed assets emitted by Vite.
 * Hashed filenames (`/assets/index-abc123.js`) are content-addressed: the byte content
 * only changes when the hash changes, so they can be cached forever at the browser and
 * the CDN. Pre-rendered HTML changes whenever we re-deploy, so we let the CDN hold a
 * short shared copy and let the browser always revalidate while it streams.
 *
 * The Cloudflare Cache API (`caches.default`) is only used for HTML because:
 *   - Hash-based asset caching already works via the immutable header.
 *   - Caching `/api/*` would break auth/session semantics.
 */

const HTML_CACHE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';
const ASSET_CACHE = 'public, max-age=31536000, immutable';
const DEFAULT_CACHE = 'public, max-age=3600';

export function cacheControlFor(pathname: string, contentType: string): string {
  if (pathname.startsWith('/api/')) return 'no-store';
  if (pathname.startsWith('/assets/')) return ASSET_CACHE;
  if (contentType.includes('text/html')) return HTML_CACHE;
  return DEFAULT_CACHE;
}
