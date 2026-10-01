const SEO_FILES = new Set(['/robots.txt', '/sitemap.xml']);

/** Site files that must be served verbatim, never masked by the SPA fallback. */
export function isSeoFile(pathname: string): boolean {
  return SEO_FILES.has(pathname);
}

export function assetCandidates(pathname: string): string[] {
  if (pathname.includes('.')) return [pathname];
  const dir = pathname.replace(/\/+$/, '');
  if (dir === '') return ['/index.html'];
  return [`${dir}/index.html`, '/index.html'];
}
