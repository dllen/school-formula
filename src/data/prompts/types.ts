import type { GradeLevel } from '../knowledge';

/** 提示词场景分类 */
export type PromptScenario =
  | 'explain'        // 知识讲解
  | 'generate'       // 出题组卷
  | 'assess'         // 测评批改
  | 'plan'           // 学习计划
  | 'error-analysis' // 错题分析
  | 'derivation'     // 公式推导
  | 'explore'        // 拓展探究
  | 'interaction';   // 亲子互动

/** 模板变量定义 */
export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'select' | 'textarea';
  options?: string[];
  defaultValue?: string;
}

/** 提示词模板 */
export interface PromptTemplate {
  id: string;
  title: string;
  scenario: PromptScenario;
  icon: string;
  description: string;
  tags: string[];
  template: string;
  variables: PromptVariable[];
  grades: GradeLevel[];
  subjects: string[];
  knowledgePointIds?: string[];
  usageCount: number;
  rating: number;
  author: string;
}
