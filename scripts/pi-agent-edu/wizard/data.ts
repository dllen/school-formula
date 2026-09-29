export const STAGES = ['小学', '初中', '高中'] as const;
export type Stage = typeof STAGES[number];

export const SUBJECTS_BY_STAGE: Record<Stage, readonly string[]> = {
  '小学': ['数学', '语文', '英语', '科学', '道德与法治'],
  '初中': ['数学', '物理', '化学', '语文', '英语', '历史', '地理', '道德与法治'],
  '高中': ['数学', '物理', '化学', '生物', '语文', '英语', '历史', '地理', '政治'],
};

export const GRADES_BY_STAGE: Record<Stage, readonly string[]> = {
  '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  '初中': ['初一', '初二', '初三'],
  '高中': ['高一', '高二', '高三'],
};

export const TASKS = [
  '教程单元',
  '题库',
  '知识点',
  '速查表',
  '公式',
  '口算',
  '掌握度技巧',
  '提示词模板',
] as const;
export type Task = typeof TASKS[number];

export const DIFFICULTIES = ['basic（基础）', 'intermediate（中等）', 'advanced（进阶）'] as const;

export const QUESTION_COUNTS = ['5', '10', '15', '20'] as const;
