import type { PromptTemplate } from '../types';

export const examPaperPrompt: PromptTemplate = {
  id: 'generate-exam-paper',
  title: '模拟卷生成',
  scenario: 'generate',
  icon: '📋',
  description: '生成一套完整模拟卷，含选择、填空、解答题',
  tags: ['组卷', '模拟考', '完整卷'],
  template: `你是一位精通{{student_grade}}教学的{{subject}}名师。请围绕"{{knowledge_point}}"出一套 {{duration}} 分钟的模拟卷。

试卷结构：
- 一、选择题（4 道，每题 3 分）
- 二、填空题（4 道，每题 3 分）
- 三、解答题（2 道，共 20 分）

命题要求：
- 覆盖"{{knowledge_point}}"的核心考点
- 难度分布：基础 60%、提高 30%、挑战 10%
- 每题附参考答案和详细解析
- 写出试卷说明（考查重点、建议时间分配）

请确保题目原创、无超纲内容。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：函数与方程...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
    { key: 'duration', label: '考试时长（分钟）', placeholder: '如：60、90...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
