import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES } from './data/reference';
import {
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
  ENGLISH_ROUTE_PATHS,
  referencePath,
  referenceSlugForAppPath,
} from './reference-routes';

describe('English route table', () => {
  it('has a canonical home plus one path per chart', () => {
    expect(ENGLISH_HOME).toBe('/en/');
    expect(ENGLISH_REFERENCE_ROUTE).toBe('/en/reference/:slug');
    expect(ENGLISH_ROUTE_PATHS).toHaveLength(1 + REFERENCE_PAGES.length);
    expect(ENGLISH_ROUTE_PATHS[0]).toBe(ENGLISH_HOME);
    expect(ENGLISH_ROUTE_PATHS).toContain(referencePath('multiplication-chart'));
  });

  it('builds chart paths and resolves them back to a slug', () => {
    expect(referencePath('irregular-verbs')).toBe('/en/reference/irregular-verbs/');
    expect(referenceSlugForAppPath('/reference/irregular-verbs')).toBe('irregular-verbs');
    expect(referenceSlugForAppPath('/reference/irregular-verbs/')).toBe('irregular-verbs');
    expect(referenceSlugForAppPath('/tutorial')).toBeNull();
  });
});
