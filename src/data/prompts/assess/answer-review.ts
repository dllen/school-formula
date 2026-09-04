import type { PromptTemplate } from '../types';

export const answerReviewPrompt: PromptTemplate = {
  id: 'assess-answer-review',
  title: '作答点评',
  scenario: 'assess',
  icon: '✍️',
  description: '对学生答案给出专业点评和改进建议',
  tags: ['点评', '反馈', '改进'],
  template: '你是一位{{student_grade}}{{subject}}名师。请对学生的作答进行专业点评。\n\n题目：{{question}}\n\n学生答案：{{student_answer}}\n\n点评要求：\n1. 先肯定学生答对的部分（哪怕只有一点点）\n2. 指出具体错误（不是"你错了"，而是"这一步的思路有个小偏差"）\n3. 分析错误原因（概念误解/计算失误/审题不清/方法不当）\n4. 给出改进建议和类似题目的解题策略\n5. 用鼓励性语言结尾，保护学生学习积极性\n\n请保持语气亲切、建议具体可操作。',
  variables: [
    { key: 'question', label: '题目', placeholder: '请输入题目内容...', required: true, type: 'textarea' },
    { key: 'student_answer', label: '学生答案', placeholder: '请输入学生作答内容...', required: true, type: 'textarea' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
