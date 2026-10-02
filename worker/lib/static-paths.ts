const SEO_FILES = new Set(['/robots.txt', '/sitemap.xml']);

/**
 * 全量预渲染的语言面。这些前缀下每一条合法路径都有自己的目录索引，所以不需要
 * 回退到应用外壳——回退会把一个 URL 拼写错误变成 200 + 空壳，即软 404。
 * 与 `KNOWN_VIEWS`（redirect.ts）一样是字面量：新增语言面时两处都要改。
 */
const PRERENDERED_SURFACES = ['/en'];

/** Site files that must be served verbatim, never masked by the SPA fallback. */
export function isSeoFile(pathname: string): boolean {
  return SEO_FILES.has(pathname);
}

function isPrerenderedSurface(dir: string): boolean {
  return PRERENDERED_SURFACES.some((surface) => dir === surface || dir.startsWith(`${surface}/`));
}

export function assetCandidates(pathname: string): string[] {
  if (pathname.includes('.')) return [pathname];
  const dir = pathname.replace(/\/+$/, '');
  if (dir === '') return ['/index.html'];
  if (isPrerenderedSurface(dir)) return [`${dir}/index.html`];
  return [`${dir}/index.html`, '/index.html'];
}
