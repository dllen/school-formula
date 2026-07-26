export type TutorialGrade = '1' | '2' | '3' | '4' | '5' | '6';

export type QuestionType = 'choice' | 'fill' | 'truefalse' | 'solve';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Diagram {
  type: 'mermaid' | 'svg';
  content: string;
  caption?: string;
}

export interface Example {
  title: string;
  problem: string;
  solution: string;
  tip: string;
}

export interface LearnSection {
  title: string;
  content: string;
  diagrams?: Diagram[];
  examples?: Example[];
}

export interface TutorialUnit {
  id: string;
  title: string;
  order: number;
  duration: string;
  objectives: string[];
  /** “教”环节：用故事/场景引入，概括本课要达成的目标 */
  teach: {
    hook: string;
    summary: string;
  };
  /** “学”环节：分节知识点、图解、例题 */
  learn: {
    sections: LearnSection[];
    tips: string[];
  };
  /** “练”环节：每单元固定 10 道测试题 */
  practice: Question[];
  /** 交给 LLM 的生成上下文 */
  aiContext: string;
}

export interface Tutorial {
  id: string;
  grade: TutorialGrade;
  gradeName: string;
  subject: string;
  subjectIcon: string;
  title: string;
  description: string;
  units: TutorialUnit[];
}
