import { ROUTE_COMPONENTS, type RouteKey } from './route-modules';

export function routeKeyForPath(pathname: string): RouteKey {
  if (pathname.startsWith('/knowledge/')) return 'knowledgeDetail';
  if (pathname.startsWith('/poetry/')) return 'poemDetail';
  if (pathname === '/en' || pathname === '/en/') return 'referenceIndex';
  if (/^\/en\/[^/]+\/?$/.test(pathname)) return 'referenceCategory';
  if (/^\/en\/[^/]+\/[^/]+\/?$/.test(pathname)) return 'referencePage';
  if (pathname === '/yuwen' || pathname === '/yuwen/') return 'yuwenIndex';
  if (/^\/yuwen\/book\/[^/]+\/?$/.test(pathname)) return 'yuwenBook';
  if (/^\/yuwen\/lesson\/[^/]+\/?$/.test(pathname)) return 'yuwenLesson';
  if (/^\/yuwen\/review\/[^/]+\/[^/]+\/?$/.test(pathname)) return 'yuwenReview';
  if (/^\/yuwen\/tingxie\/[^/]+\/[^/]+\/?$/.test(pathname)) return 'yuwenTingxie';
  if (/^\/yuwen\/char\/[^/]+\/?$/.test(pathname)) return 'yuwenChar';
  if (pathname === '/yuwen/pinyin' || pathname === '/yuwen/pinyin/') return 'yuwenPinyinIndex';
  if (/^\/yuwen\/pinyin\/[^/]+\/?$/.test(pathname)) return 'yuwenPinyinStem';
  if (pathname === '/yuwen/duoyin' || pathname === '/yuwen/duoyin/') return 'yuwenDuoyin';
  return 'home';
}

export function preloadRoute(pathname: string): Promise<void> {
  return ROUTE_COMPONENTS[routeKeyForPath(pathname)].preload();
}
