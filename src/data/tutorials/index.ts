export * from './types';
export { PRIMARY_MATH_TUTORIALS } from './primary-math';
export { PRIMARY_CHINESE_TUTORIALS } from './primary-chinese';
export { PRIMARY_ENGLISH_TUTORIALS } from './primary-english';
export { PRIMARY_SCIENCE_TUTORIALS } from './primary-science';
export { PRIMARY_MORAL_TUTORIALS } from './primary-moral';
export { MIDDLE_MATH_TUTORIALS } from './middle-math';
export { MIDDLE_PHYSICS_TUTORIALS } from './middle-physics';
export { MIDDLE_CHEMISTRY_TUTORIALS } from './middle-chemistry';
export { MIDDLE_BIOLOGY_TUTORIALS } from './middle-biology';
export { MIDDLE_HISTORY_TUTORIALS } from './middle-history';
export { MIDDLE_GEOGRAPHY_TUTORIALS } from './middle-geography';
export { MIDDLE_CHINESE_TUTORIALS } from './middle-chinese';
export { MIDDLE_ENGLISH_TUTORIALS } from './middle-english';
export { MIDDLE_MORAL_TUTORIALS } from './middle-moral';
export { HIGH_POLITICS_TUTORIALS } from './high-politics';

import { PRIMARY_MATH_TUTORIALS } from './primary-math';
import { PRIMARY_CHINESE_TUTORIALS } from './primary-chinese';
import { PRIMARY_ENGLISH_TUTORIALS } from './primary-english';
import { PRIMARY_SCIENCE_TUTORIALS } from './primary-science';
import { PRIMARY_MORAL_TUTORIALS } from './primary-moral';
import { MIDDLE_MATH_TUTORIALS } from './middle-math';
import { MIDDLE_PHYSICS_TUTORIALS } from './middle-physics';
import { MIDDLE_CHEMISTRY_TUTORIALS } from './middle-chemistry';
import { MIDDLE_BIOLOGY_TUTORIALS } from './middle-biology';
import { MIDDLE_HISTORY_TUTORIALS } from './middle-history';
import { MIDDLE_GEOGRAPHY_TUTORIALS } from './middle-geography';
import { MIDDLE_CHINESE_TUTORIALS } from './middle-chinese';
import { MIDDLE_ENGLISH_TUTORIALS } from './middle-english';
import { MIDDLE_MORAL_TUTORIALS } from './middle-moral';
import { HIGH_MATH_TUTORIALS } from './high-math';
import { HIGH_PHYSICS_TUTORIALS } from './high-physics';
import { HIGH_CHEMISTRY_TUTORIALS } from './high-chemistry';
import { HIGH_BIOLOGY_TUTORIALS } from './high-biology';
import { HIGH_HISTORY_TUTORIALS } from './high-history';
import { HIGH_GEOGRAPHY_TUTORIALS } from './high-geography';
import { HIGH_POLITICS_TUTORIALS } from './high-politics';
import type { Tutorial, TutorialUnit } from './types';

export const ALL_TUTORIALS: Tutorial[] = [
  ...PRIMARY_MATH_TUTORIALS,
  ...PRIMARY_CHINESE_TUTORIALS,
  ...PRIMARY_ENGLISH_TUTORIALS,
  ...PRIMARY_SCIENCE_TUTORIALS,
  ...PRIMARY_MORAL_TUTORIALS,
  ...MIDDLE_MATH_TUTORIALS,
  ...MIDDLE_PHYSICS_TUTORIALS,
  ...MIDDLE_CHEMISTRY_TUTORIALS,
  ...MIDDLE_BIOLOGY_TUTORIALS,
  ...MIDDLE_HISTORY_TUTORIALS,
  ...MIDDLE_GEOGRAPHY_TUTORIALS,
  ...MIDDLE_CHINESE_TUTORIALS,
  ...MIDDLE_ENGLISH_TUTORIALS,
  ...MIDDLE_MORAL_TUTORIALS,
  ...HIGH_MATH_TUTORIALS,
  ...HIGH_PHYSICS_TUTORIALS,
  ...HIGH_CHEMISTRY_TUTORIALS,
  ...HIGH_BIOLOGY_TUTORIALS,
  ...HIGH_HISTORY_TUTORIALS,
  ...HIGH_GEOGRAPHY_TUTORIALS,
  ...HIGH_POLITICS_TUTORIALS,
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
