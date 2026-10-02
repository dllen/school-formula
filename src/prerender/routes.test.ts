import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { ENGLISH_ROUTE_PATHS } from '../reference-routes';
import { PRERENDER_PATHS } from './routes';

describe('PRERENDER_PATHS', () => {
  it('includes root, all view paths, every knowledge point and the English surface', () => {
    const kpCount = KNOWLEDGE_DATA.reduce(
      (sum, grade) => sum + grade.subjects.reduce((s, sub) => s + sub.knowledgePoints.length, 0),
      0,
    );
    expect(PRERENDER_PATHS).toContain('/');
    expect(PRERENDER_PATHS).toContain('/tutorial');
    expect(PRERENDER_PATHS).toContain('/ai-chat');
    expect(PRERENDER_PATHS).toContain('/en/');
    expect(PRERENDER_PATHS).toContain('/en/math/');
    expect(PRERENDER_PATHS).toContain('/en/science/');
    expect(PRERENDER_PATHS).toContain('/en/english/');
    expect(PRERENDER_PATHS).toContain('/en/math/multiplication-chart/');
    expect(PRERENDER_PATHS.filter((p) => p.startsWith('/knowledge/'))).toHaveLength(kpCount);
    expect(PRERENDER_PATHS).toHaveLength(1 + 10 + kpCount + ENGLISH_ROUTE_PATHS.length);
  });

  it('has no duplicates', () => {
    expect(new Set(PRERENDER_PATHS).size).toBe(PRERENDER_PATHS.length);
  });
});
