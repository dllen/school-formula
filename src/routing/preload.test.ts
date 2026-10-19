import { describe, expect, it } from 'vitest';
import { routeKeyForPath } from './preload';

describe('routeKeyForPath', () => {
  it('maps app and english routes to their lazy modules', () => {
    expect(routeKeyForPath('/')).toBe('home');
    expect(routeKeyForPath('/tutorial')).toBe('home');
    expect(routeKeyForPath('/knowledge/p-math-1')).toBe('knowledgeDetail');
    expect(routeKeyForPath('/poetry/primary-tang-jing-ye-si')).toBe('poemDetail');
    expect(routeKeyForPath('/en/')).toBe('referenceIndex');
    expect(routeKeyForPath('/en/math/')).toBe('referenceCategory');
    expect(routeKeyForPath('/en/math/multiplication-chart/')).toBe('referencePage');
  });
});
