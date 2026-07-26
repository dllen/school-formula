export type TutorialGrade = '1' | '2' | '3' | '4' | '5' | '6';

export interface TutorialUnit {
  id: string;
  title: string;
  order: number;
  duration: string;
  objectives: string[];
  /** 静态编写的核心内容，支持 Markdown */
  staticContent: string;
  /** 交给 LLM 的生成上下文，用于补全更生动的讲解/例题/练习 */
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
