export const CANONICAL_HOST = 'syy.global';

const REDIRECT_HOSTS = new Set(['syy.mobi', 'www.syy.mobi', 'syy.one', 'www.syy.one']);

const KNOWN_VIEWS = new Set([
  'tutorial', 'cheatsheet', 'mental-math', 'formula', 'mastery',
  'practice', 'notes', 'zizhi', 'shiji', 'ai-chat',
]);

export function hostRedirect(url: URL): string | null {
  if (!REDIRECT_HOSTS.has(url.host)) return null;
  const target = new URL(url.toString());
  target.host = CANONICAL_HOST;
  return target.toString();
}

export function legacyViewRedirect(url: URL): string | null {
  if (url.pathname !== '/') return null;
  const view = url.searchParams.get('view');
  if (!view || !KNOWN_VIEWS.has(view)) return null;
  const rest = new URLSearchParams(url.searchParams);
  rest.delete('view');
  const qs = rest.toString();
  return `${url.origin}/${view}${qs ? `?${qs}` : ''}`;
}
