import { ROUTE_COMPONENTS, type RouteKey } from './route-modules';

export function routeKeyForPath(pathname: string): RouteKey {
  if (pathname.startsWith('/knowledge/')) return 'knowledgeDetail';
  if (pathname.startsWith('/poetry/')) return 'poemDetail';
  if (pathname === '/en' || pathname === '/en/') return 'referenceIndex';
  if (/^\/en\/[^/]+\/?$/.test(pathname)) return 'referenceCategory';
  if (/^\/en\/[^/]+\/[^/]+\/?$/.test(pathname)) return 'referencePage';
  return 'home';
}

export function preloadRoute(pathname: string): Promise<void> {
  return ROUTE_COMPONENTS[routeKeyForPath(pathname)].preload();
}
