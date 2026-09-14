export * from './types';
export { PRIMARY_MATH_TUTORIALS } from './primary-math';
export { PRIMARY_CHINESE_TUTORIALS } from './primary-chinese';
export { PRIMARY_ENGLISH_TUTORIALS } from './primary-english';
export { MIDDLE_MATH_TUTORIALS } from './middle-math';
export { MIDDLE_PHYSICS_TUTORIALS } from './middle-physics';
export { MIDDLE_CHEMISTRY_TUTORIALS } from './middle-chemistry';
export { MIDDLE_BIOLOGY_TUTORIALS } from './middle-biology';
export { MIDDLE_HISTORY_TUTORIALS } from './middle-history';
export { MIDDLE_GEOGRAPHY_TUTORIALS } from './middle-geography';
export { MIDDLE_CHINESE_TUTORIALS } from './middle-chinese';
export { MIDDLE_ENGLISH_TUTORIALS } from './middle-english';

import { PRIMARY_MATH_TUTORIALS } from './primary-math';
import { PRIMARY_CHINESE_TUTORIALS } from './primary-chinese';
import { PRIMARY_ENGLISH_TUTORIALS } from './primary-english';
import { MIDDLE_MATH_TUTORIALS } from './middle-math';
import { MIDDLE_PHYSICS_TUTORIALS } from './middle-physics';
import { MIDDLE_CHEMISTRY_TUTORIALS } from './middle-chemistry';
import { MIDDLE_BIOLOGY_TUTORIALS } from './middle-biology';
import { MIDDLE_HISTORY_TUTORIALS } from './middle-history';
import { MIDDLE_GEOGRAPHY_TUTORIALS } from './middle-geography';
import { MIDDLE_CHINESE_TUTORIALS } from './middle-chinese';
import { MIDDLE_ENGLISH_TUTORIALS } from './middle-english';
import type { Tutorial, TutorialUnit } from './types';

export const ALL_TUTORIALS: Tutorial[] = [
  ...PRIMARY_MATH_TUTORIALS,
  ...PRIMARY_CHINESE_TUTORIALS,
  ...PRIMARY_ENGLISH_TUTORIALS,
  ...MIDDLE_MATH_TUTORIALS,
  ...MIDDLE_PHYSICS_TUTORIALS,
  ...MIDDLE_CHEMISTRY_TUTORIALS,
  ...MIDDLE_BIOLOGY_TUTORIALS,
  ...MIDDLE_HISTORY_TUTORIALS,
  ...MIDDLE_GEOGRAPHY_TUTORIALS,
  ...MIDDLE_CHINESE_TUTORIALS,
  ...MIDDLE_ENGLISH_TUTORIALS,
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
