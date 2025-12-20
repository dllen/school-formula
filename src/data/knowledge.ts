import type { GradeData } from './types';
import { PRIMARY_DATA } from './knowledge/primary';
import { MIDDLE_DATA } from './knowledge/middle';
import { HIGH_DATA } from './knowledge/high';

export * from './types';

export const KNOWLEDGE_DATA: GradeData[] = [
  PRIMARY_DATA,
  MIDDLE_DATA,
  HIGH_DATA
];
