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

/**
 * 图表迁到学科分层 URL 之前的历史 slug→学科映射。
 *
 * 这是一份**冻结的历史记录**：这六个 URL 在 2026-10 之前对外发布过，写完就再也不会
 * 增长。所以它是字面量，且刻意不从 `src/data/reference` 导入——worker 不在任何
 * tsconfig 的 include 里（`tsconfig.app.json` 只含 `src`），为六个常量把它绑到 src
 * 的整个模块图上不划算。
 */
const LEGACY_REFERENCE_CATEGORY: Record<string, string> = {
  'multiplication-chart': 'math',
  'squares-cubes-roots': 'math',
  'trigonometric-identities': 'math',
  'metric-conversions': 'math',
  'physics-constants': 'science',
  'irregular-verbs': 'english',
};

export function legacyReferenceRedirect(url: URL): string | null {
  const match = /^\/en\/reference\/([^/]+)\/?$/.exec(url.pathname);
  if (!match) return null;
  const category = LEGACY_REFERENCE_CATEGORY[match[1]];
  if (!category) return null;
  return `${url.origin}/en/${category}/${match[1]}/`;
}
