import type { GradeLevel } from '../knowledge';
import type { PromptTemplate, PromptScenario } from './types';
import { EXPLAIN_PROMPTS } from './explain';
import { GENERATE_PROMPTS } from './generate';
import { ASSESS_PROMPTS } from './assess';
import { PLAN_PROMPTS } from './plan';
import { ERROR_ANALYSIS_PROMPTS } from './error-analysis';
import { DERIVATION_PROMPTS } from './derivation';
import { EXPLORE_PROMPTS } from './explore';
import { INTERACTION_PROMPTS } from './interaction';

export type { PromptTemplate, PromptScenario } from './types';
export type { GradeLevel } from '../knowledge';

export const ALL_PROMPTS: PromptTemplate[] = [
  ...EXPLAIN_PROMPTS,
  ...GENERATE_PROMPTS,
  ...ASSESS_PROMPTS,
  ...PLAN_PROMPTS,
  ...ERROR_ANALYSIS_PROMPTS,
  ...DERIVATION_PROMPTS,
  ...EXPLORE_PROMPTS,
  ...INTERACTION_PROMPTS,
];

/** 按场景查找 */
export function getPromptsByScenario(scenario: PromptScenario): PromptTemplate[] {
  return ALL_PROMPTS.filter(p => p.scenario === scenario);
}

/** 为指定场景+年级+学科选择最佳模板 */
export function selectBestTemplate(
  scenario: PromptScenario,
  grade: GradeLevel,
  subject: string,
): PromptTemplate {
  const all = ALL_PROMPTS.filter(
    p => p.scenario === scenario &&
         (p.subjects.includes(subject) || p.subjects.includes('all')),
  );
  // 1. 年级专属
  const gradeMatch = all.find(p => p.gradeLevel === grade);
  if (gradeMatch) return gradeMatch;
  // 2. 通用（gradeLevel 为 undefined 或 'all'）
  const fallback = all.find(p => !p.gradeLevel || p.gradeLevel === 'all');
  if (fallback) return fallback;
  throw new Error(`no template found for ${scenario}/${grade}/${subject}`);
}

/** 按年级和学科筛选 */
export function filterPrompts(filters: {
  grade?: GradeLevel;
  subject?: string;
  scenario?: PromptScenario;
}): PromptTemplate[] {
  return ALL_PROMPTS.filter(p => {
    if (filters.grade && !p.grades.includes(filters.grade)) return false;
    if (filters.subject && !p.subjects.includes(filters.subject)) return false;
    if (filters.scenario && p.scenario !== filters.scenario) return false;
    return true;
  });
}

/** 按知识点查找关联模板 */
export function getPromptsByKnowledgePoint(kpId: string): PromptTemplate[] {
  return ALL_PROMPTS.filter(p => p.knowledgePointIds?.includes(kpId));
}

/** 搜索模板 */
export function searchPrompts(query: string): PromptTemplate[] {
  const q = query.toLowerCase();
  return ALL_PROMPTS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}

/** 根据 ID 查找 */
export function getPromptById(id: string): PromptTemplate | undefined {
  return ALL_PROMPTS.find(p => p.id === id);
}

export default ALL_PROMPTS;
