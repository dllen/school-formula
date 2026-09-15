export interface Technique {
  id: string;
  grade: string;
  stage: '小学' | '中学' | '高中';
  name: string;
  summary: string;
  kou: string;
  steps: string[];
  prereq: string | null;
  fig?: string | null;
  /** 典型例题 */
  examples?: string[];
  /** 常见错误 */
  mistakes?: string[];
  /** 生活应用 */
  realWorld?: string[];
}

export interface Question {
  q: string;
  opts: string[];
  ans: number;
  level: number;
  explain: string;
  point: string;
  fig?: string | null;
}

export interface PracticeRecord {
  techniqueId: string;
  totalAttempts: number;
  correctCount: number;
  lastPracticedAt: number;
  weakPoints: string[];
}

/** 按天记录的练习数据，key 为 YYYY-MM-DD */
export interface DailyLog {
  attempts: number;
  correct: number;
  techniques: string[];
}

export interface MasteryProgress {
  records: Record<string, PracticeRecord>;
  completedTechniques: string[];
  dailyLog?: Record<string, DailyLog>;
}
