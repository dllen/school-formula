import type { GradeLevel } from '../types';
import { PRIMARY_POEMS } from './primary';
import { MIDDLE_POEMS } from './middle';
import { HIGH_POEMS } from './high';
import type { Poem } from './types';

export * from './types';

export const ALL_POEMS: Poem[] = [
  ...PRIMARY_POEMS,
  ...MIDDLE_POEMS,
  ...HIGH_POEMS,
];

export const POEMS_BY_ID: Record<string, Poem> = Object.fromEntries(
  ALL_POEMS.map((p) => [p.id, p]),
);

export function getPoemsByGrade(grade: GradeLevel): Poem[] {
  return ALL_POEMS.filter((p) => p.grade === grade);
}

export function getPoemById(id: string): Poem | undefined {
  return POEMS_BY_ID[id];
}