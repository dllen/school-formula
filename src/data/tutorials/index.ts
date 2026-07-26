export * from './types';
export { PRIMARY_MATH_TUTORIALS } from './primary-math';

import { PRIMARY_MATH_TUTORIALS } from './primary-math';
import type { Tutorial } from './types';

export const ALL_TUTORIALS: Tutorial[] = [
  ...PRIMARY_MATH_TUTORIALS
];

export function getTutorialsByGrade(grade: string): Tutorial[] {
  return ALL_TUTORIALS.filter(t => t.grade === grade);
}
