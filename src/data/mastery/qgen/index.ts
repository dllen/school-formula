import type { Question } from '../types';
import { GENERATORS } from './generators';

export function generateQuestions(techniqueId: string, n: number = 6): Question[] {
  const gen = GENERATORS[techniqueId];
  if (!gen) return [];
  const out: Question[] = [];
  for (let i = 0; i < n; i++) {
    out.push(gen());
  }
  return out;
}

export function getSupportedTechniques(): string[] {
  return Object.keys(GENERATORS);
}
