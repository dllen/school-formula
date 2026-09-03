import type { GradeLevel } from '../knowledge';

export type QuestionType = 'choice' | 'fill-blank' | 'true-false';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface Question {
  /** 全局唯一 ID，格式：q-{subject}-{grade}-{hash} */
  id: string;
  /** 题型 */
  type: QuestionType;
  /** 难度 */
  difficulty: Difficulty;
  /** 题干（支持 Markdown 行内格式） */
  stem: string;
  /** 选择题选项（仅 choice 类型） */
  options?: string[];
  /** 答案（choice 为选项字母 A/B/C/D，fill-blank 为文本，true-false 为 true/false） */
  answer: string;
  /** 答案解析 */
  explanation: string;
  /** 标签（关联专题/主题） */
  tags: string[];
  /** 关联知识点 ID */
  knowledgePointIds: string[];
  /** 学科 */
  subject: string;
  /** 学段 */
  grade: GradeLevel;
}

/** 筛选选项 */
export interface QuestionFilter {
  subject?: string;
  grade?: GradeLevel;
  difficulty?: Difficulty;
  type?: QuestionType;
  tags?: string[];
  knowledgePointIds?: string[];
}

/** 单题答题记录 */
export interface AnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // 秒
}

/** 练习会话 */
export interface PracticeSession {
  id: string;
  questions: Question[];
  answers: AnswerRecord[];
  startedAt: number;
  completedAt?: number;
}
