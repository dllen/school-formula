import { TASKS, type Stage, type Task } from './data.js';

/** 任务类型 → 入库 kind（staging 目录名）。 */
export function kindFromTask(task: Task): string {
  switch (task) {
    case '教程单元': return 'tutorials';
    case '题库': return 'questions';
    case '知识点': return 'knowledge';
    case '速查表': return 'cheatsheets';
    case '公式': return 'formulas';
    case '口算': return 'mental-math';
    case '掌握度技巧': return 'techniques';
    case '提示词模板': return 'prompts';
  }
}

/** 入库 kind 白名单（staging 目录名），由任务类型推导。 */
export const KNOWN_KINDS = new Set(TASKS.map(kindFromTask));

export interface WizardResult {
  provider: string;
  model: string;
  stage: Stage;
  subject: string;
  grade: string;
  task: Task;
  difficulty?: string;
  questionCount?: string;
}
