import type { Question, QuestionFilter, Difficulty, QuestionType } from './types';
import { primaryMath } from './primary-math';
import { primaryMathQuestions } from './primary-math-questions';
import { primaryChineseQuestions } from './primary-chinese-questions';
import { primaryEnglishQuestions } from './primary-english-questions';
import { middleMathQuestions } from './middle-math-questions';
import { middlePhysicsQuestions } from './middle-physics-questions';
import { middleChineseQuestions } from './middle-chinese-questions';
import { middleChemistryQuestions } from './middle-chemistry-questions';
import { middleBiologyQuestions } from './middle-biology-questions';
import { middleEnglishQuestions } from './middle-english-questions';
import { middleHistoryQuestions } from './middle-history-questions';
import { middleGeographyQuestions } from './middle-geography-questions';
import { middleMoralQuestions } from './middle-moral-questions';

export type { Question, QuestionFilter, Difficulty, QuestionType };

export const ALL_QUESTIONS: Question[] = [
  ...primaryMath,
  ...primaryMathQuestions,
  ...primaryChineseQuestions,
  ...primaryEnglishQuestions,
  ...middleMathQuestions,
  ...middlePhysicsQuestions,
  ...middleChineseQuestions,
  ...middleChemistryQuestions,
  ...middleBiologyQuestions,
  ...middleEnglishQuestions,
  ...middleHistoryQuestions,
  ...middleGeographyQuestions,
  ...middleMoralQuestions,
];

/** 按知识点 ID 查找题目 */
export function getQuestionsByKnowledgePoint(kpId: string): Question[] {
  return ALL_QUESTIONS.filter(q => q.knowledgePointIds.includes(kpId));
}

/** 按标签查找题目 */
export function getQuestionsByTag(tag: string): Question[] {
  return ALL_QUESTIONS.filter(q => q.tags.includes(tag));
}

/** 按条件筛选题目 */
export function filterQuestions(filter: QuestionFilter): Question[] {
  return ALL_QUESTIONS.filter(q => {
    if (filter.subject && q.subject !== filter.subject) return false;
    if (filter.grade && q.grade !== filter.grade) return false;
    if (filter.difficulty && q.difficulty !== filter.difficulty) return false;
    if (filter.type && q.type !== filter.type) return false;
    if (filter.tags && !filter.tags.some(t => q.tags.includes(t))) return false;
    if (filter.knowledgePointIds && !filter.knowledgePointIds.some(id => q.knowledgePointIds.includes(id))) return false;
    return true;
  });
}

/** 随机获取 N 道题（用于组卷） */
export function getRandomQuestions(filter: QuestionFilter, count: number): Question[] {
  const filtered = filterQuestions(filter);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** 获取所有不重复的标签 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  ALL_QUESTIONS.forEach(q => q.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet);
}

/** 获取所有不重复的学科 */
export function getAllSubjects(): string[] {
  return Array.from(new Set(ALL_QUESTIONS.map(q => q.subject)));
}

/** 根据 ID 查找单道题 */
export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find(q => q.id === id);
}
