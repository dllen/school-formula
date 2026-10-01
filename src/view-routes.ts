import type { ViewType } from './components/Header/types';

export const VIEW_PATHS: Record<Exclude<ViewType, 'knowledge'>, `/${string}`> = {
  tutorial: '/tutorial',
  cheatsheet: '/cheatsheet',
  'mental-math': '/mental-math',
  formula: '/formula',
  mastery: '/mastery',
  practice: '/practice',
  notes: '/notes',
  zizhi: '/zizhi',
  shiji: '/shiji',
  'ai-chat': '/ai-chat',
};

export function pathForView(view: ViewType): string {
  return view === 'knowledge' ? '/' : VIEW_PATHS[view];
}

export function viewFromPath(pathname: string): ViewType | null {
  if (pathname === '/') return 'knowledge';
  const entry = Object.entries(VIEW_PATHS).find(([, path]) => path === pathname);
  return entry ? (entry[0] as ViewType) : null;
}

export function isViewName(value: string): value is ViewType {
  return value === 'knowledge' || value in VIEW_PATHS;
}
