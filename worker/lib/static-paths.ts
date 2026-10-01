export function assetCandidates(pathname: string): string[] {
  if (pathname.includes('.')) return [pathname];
  const dir = pathname.replace(/\/+$/, '');
  if (dir === '') return ['/index.html'];
  return [`${dir}/index.html`, '/index.html'];
}
