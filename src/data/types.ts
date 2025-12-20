export type GradeLevel = 'primary' | 'middle' | 'high';

export interface KnowledgePoint {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

export interface Subject {
  id: string;
  name: string;
  icon?: string; // Optional icon name or emoji
  knowledgePoints: KnowledgePoint[];
}

export interface GradeData {
  id: GradeLevel;
  name: string;
  subjects: Subject[];
}
