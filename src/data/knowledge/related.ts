import { KNOWLEDGE_DATA } from '../knowledge';
import type { KnowledgePoint } from '../types';
export function relatedKnowledgePoints(pointId: string, limit = 5): KnowledgePoint[] {
  for (const grade of KNOWLEDGE_DATA) {
    for (const subject of grade.subjects) {
      const point = subject.knowledgePoints.find(p => p.id === pointId);
      if (!point) continue;
      return subject.knowledgePoints.filter(p => p.id !== pointId).slice(0, limit);
    }
  }
  return [];
}
