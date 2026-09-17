// mapping.ts

/** 学科中文名 → 数据文件键。 */
export const SUBJECT_KEYS: Record<string, string> = {
  '数学': 'math',
  '语文': 'chinese',
  '英语': 'english',
  '科学': 'science',
  '道德与法治': 'moral',
  '物理': 'physics',
  '化学': 'chemistry',
  '生物': 'biology',
  '历史': 'history',
  '地理': 'geography',
  '政治': 'politics',
};

/** 把学段（数值字符串或 GradeLevel 单词）归一化为文件级 stage。 */
export function gradeToStage(grade: string): 'primary' | 'middle' | 'high' {
  if (grade === 'primary' || grade === 'middle' || grade === 'high') return grade;
  const n = Number(grade);
  if (n >= 1 && n <= 6) return 'primary';
  if (n >= 7 && n <= 9) return 'middle';
  if (n >= 10 && n <= 12) return 'high';
  throw new Error(`未知学段: ${grade}`);
}
