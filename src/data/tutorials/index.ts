export * from './types';
export { PRIMARY_MATH_TUTORIALS } from './primary-math';

import { PRIMARY_MATH_TUTORIALS } from './primary-math';
import type { Tutorial, TutorialUnit } from './types';

export const ALL_TUTORIALS: Tutorial[] = [
  ...PRIMARY_MATH_TUTORIALS
];

export const ALL_UNITS: TutorialUnit[] = ALL_TUTORIALS.flatMap(t => t.units);

export function getTutorialsByGrade(grade: string): Tutorial[] {
  return ALL_TUTORIALS.filter(t => t.grade === grade);
}

export function getUnitById(unitId: string): TutorialUnit | undefined {
  return ALL_UNITS.find(u => u.id === unitId);
}

export function validatePracticeQuestionCount(): string[] {
  const errors: string[] = [];
  for (const tutorial of ALL_TUTORIALS) {
    for (const unit of tutorial.units) {
      if (unit.practice.length !== 10) {
        errors.push(`${tutorial.gradeName} ${unit.title} 练习题数量为 ${unit.practice.length}，应为 10`);
      }
    }
  }
  return errors;
}
