import type { PromptTemplate } from '../types';

export const realWorldPrompt: PromptTemplate = {
  id: 'deriv-real-world',
  title: '实际应用',
  scenario: 'derivation',
  icon: '🌍',
  description: '展示公式在生活中的实际应用',
  tags: ['应用', '生活', '价值'],
  template: '你是一位擅长联系实际的名师。请展示"{{formula}}"在现实生活中的实际应用。\n\n目标学生：{{student_grade}}\n\n应用展示：\n1. **日常生活**：这个公式在日常生活中哪里用得到？（至少 3 个场景）\n2. **工程科技**：在哪些科技领域这个公式是基础？\n3. **自然现象**：自然界中哪些现象可以用这个公式解释？\n4. **动手实验**：设计一个简单的家庭实验来验证这个公式\n5. **职业连接**：哪些职业需要用到这个公式？\n6. **思考题**：如果这个公式"不存在"，世界会变成什么样？\n\n请确保例子真实、有趣，让学生感到"学了有用"。',
  variables: [
    { key: 'formula', label: '公式/定理', placeholder: '如：杠杆原理、能量守恒...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
