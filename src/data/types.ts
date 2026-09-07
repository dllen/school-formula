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

  // 系统教程内容（结构化教学：步骤 + 示例 + 练习）
  tutorialContent?: TutorialContent;
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

// ============ 系统教程字段 ============

/** 教程中的例题精讲（由易到难） */
export interface TutorialExample {
  /** 例题标题 */
  title: string;
  /** 题目 */
  problem: string;
  /** 完整解答 */
  solution: string;
  /** 思路点拨 */
  tip: string;
}

/** 教程中的配套练习 */
export interface TutorialExercise {
  /** 练习题干 */
  question: string;
  /** 参考答案 */
  answer: string;
  /** 解题提示 */
  explanation: string;
}

/** 系统化教程内容：🎯 本课目标 + 📖 知识讲解 + ✏️ 例题精讲 + 🧩 亲子互动 + 📝 课后练习 */
export interface TutorialContent {
  /** 🎯 本课目标：3-5 条学习目标 */
  objectives: string[];
  /** 📖 知识讲解：核心概念 + 生活案例（Markdown） */
  explanation: string;
  /** ✏️ 例题精讲：2-3 道由易到难 */
  examples: TutorialExample[];
  /** 🧩 亲子互动：5-10 分钟活动描述 */
  interaction: string;
  /** 📝 课后练习：3-5 题 */
  exercises: TutorialExercise[];
}
