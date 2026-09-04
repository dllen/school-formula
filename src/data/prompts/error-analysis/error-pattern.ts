import type { PromptTemplate } from '../types';

export const errorPatternPrompt: PromptTemplate = {
  id: 'error-pattern',
  title: '错误模式',
  scenario: 'error-analysis',
  icon: '📊',
  description: '识别学生反复出现的错误模式',
  tags: ['模式', '规律', '预防'],
  template: '你是一位擅长学情分析的名师。请分析学生的错题集，识别反复出现的错误模式。\n\n错题列表：\n{{error_list}}\n学生年级：{{student_grade}}\n\n分析框架：\n1. **模式识别**：\n   - 哪些错误反复出现？（至少分析 3 个模式）\n   - 每个模式的出现频率\n2. **模式分类**：\n   - 知识型错误（某个知识点总是错）\n   - 方法型错误（某类方法总是用错）\n   - 习惯型错误（抄错、漏写、看错）\n   - 心理型错误（难题放弃、简单题粗心）\n3. **深层原因**：为什么会形成这些模式？\n4. **干预方案**：每个模式对应一个具体的纠正策略\n5. **预防机制**：如何在日常学习中打破这些模式\n6. **家长配合**：家长可以做什么来帮助孩子',
  variables: [
    { key: 'error_list', label: '错题列表', placeholder: '请输入错题（题目+学生答案），每题一行...', required: true, type: 'textarea' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
