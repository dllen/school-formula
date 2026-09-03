import { KNOWLEDGE_DATA } from '../../src/data/knowledge';
import type { GradeLevel } from '../../src/data/types';

export interface KnowledgePointTask {
  id: string;
  title: string;
  description: string;
  tags: string[];
  subject: string;
  grade: GradeLevel;
}

export function loadKnowledgePoints(grade?: GradeLevel, subject?: string): KnowledgePointTask[] {
  const results: KnowledgePointTask[] = [];

  for (const gradeData of KNOWLEDGE_DATA) {
    if (grade && gradeData.id !== grade) continue;

    for (const subj of gradeData.subjects) {
      if (subject && subj.name !== subject) continue;

      for (const kp of subj.knowledgePoints) {
        results.push({
          id: kp.id,
          title: kp.title,
          description: kp.description,
          tags: kp.tags || [],
          subject: subj.name,
          grade: gradeData.id,
        });
      }
    }
  }

  return results;
}
