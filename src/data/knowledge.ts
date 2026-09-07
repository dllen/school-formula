import type { GradeData } from './types';
import { primaryData } from './knowledge/primary';
import { middleData } from './knowledge/middle';
import { highData } from './knowledge/high';

export * from './types';

export const KNOWLEDGE_DATA: GradeData[] = [
  primaryData,
  middleData,
  highData
];
