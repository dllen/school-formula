import { describe, expect, it } from 'vitest';
import { VIEW_PATHS, isViewName, pathForView, viewFromPath } from './view-routes';

describe('view-routes', () => {
  it('maps every non-knowledge view to a root-level path', () => {
    expect(VIEW_PATHS).toEqual({
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
    });
  });

  it('pathForView maps knowledge to root and others to their path', () => {
    expect(pathForView('knowledge')).toBe('/');
    expect(pathForView('practice')).toBe('/practice');
    expect(pathForView('ai-chat')).toBe('/ai-chat');
  });

  it('viewFromPath parses known paths and rejects unknown ones', () => {
    expect(viewFromPath('/')).toBe('knowledge');
    expect(viewFromPath('/mental-math')).toBe('mental-math');
    expect(viewFromPath('/knowledge/p-math-1')).toBeNull();
    expect(viewFromPath('/nope')).toBeNull();
  });

  it('isViewName narrows valid view names', () => {
    expect(isViewName('knowledge')).toBe(true);
    expect(isViewName('zizhi')).toBe(true);
    expect(isViewName('bogus')).toBe(false);
  });
});
