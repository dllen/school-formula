import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from '../knowledge';
import { relatedKnowledgePoints } from './related';

describe('relatedKnowledgePoints', () => {
  it('returns siblings of the first knowledge point, excluding itself', () => {
    const firstPoint =
      KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[0];
    const result = relatedKnowledgePoints(firstPoint.id);

    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(5);
    expect(result.find((p) => p.id === firstPoint.id)).toBeUndefined();

    const secondPoint =
      KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[1];
    expect(result.find((p) => p.id === secondPoint.id)).toBeDefined();
  });

  it('returns an empty array when the knowledge point id is missing', () => {
    expect(relatedKnowledgePoints('missing-id')).toEqual([]);
  });
});
