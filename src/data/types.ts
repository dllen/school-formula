export type GradeLevel = 'primary' | 'middle' | 'high';

export interface KnowledgePoint {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  detailedExplanation?: string;
  studyTips?: string[];
  practiceQuestions?: { question: string; answer: string }[];
  
  // 趣味化字段
  /** 主形象 emoji，如 🧮 🔢 📐 */
  funEmoji?: string;
  /** 冷知识 / 趣味事实（一句话） */
  funFact?: string;
  /** 生活中的有趣故事（50-100字） */
  funStory?: string;
  /** 互动小问题 */
  funQuestion?: string;
  /** 互动问题答案 */
  funQuestionAnswer?: string;
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
