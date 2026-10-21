import { describe, expect, it } from 'vitest';
import { ALL_QUESTIONS } from './index';
import { KNOWLEDGE_DATA } from '../knowledge';

const ALL_KNOWLEDGE_IDS: Set<string> = new Set(
  KNOWLEDGE_DATA.flatMap((grade) =>
    grade.subjects.flatMap((subject) => subject.knowledgePoints.map((point) => point.id)),
  ),
);

describe('question bank integrity', () => {
  it('gives every question a globally unique id', () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const question of ALL_QUESTIONS) {
      if (seen.has(question.id)) duplicates.push(question.id);
      seen.add(question.id);
    }
    expect(duplicates).toEqual([]);
  });

  it('leaves no unreplaced template placeholder in any question text', () => {
    const offenders: string[] = [];
    for (const question of ALL_QUESTIONS) {
      const text = [
        question.stem,
        question.explanation ?? '',
        ...(question.options ?? []),
      ].join(' ');
      if (/\$\{[a-zA-Z_][a-zA-Z0-9_]*\}/.test(text)) {
        offenders.push(question.id);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('points every knowledgePointId at a knowledge point that exists', () => {
    const broken: string[] = [];
    for (const question of ALL_QUESTIONS) {
      for (const id of question.knowledgePointIds ?? []) {
        if (!ALL_KNOWLEDGE_IDS.has(id)) broken.push(`${question.id} -> ${id}`);
      }
    }
    expect(broken).toEqual([]);
  });
});
