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

export interface MasteryProgress {
  records: Record<string, PracticeRecord>;
  completedTechniques: string[];
}
