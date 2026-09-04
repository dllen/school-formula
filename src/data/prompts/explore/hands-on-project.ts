import type { PromptTemplate } from '../types';

export const handsOnProjectPrompt: PromptTemplate = {
  id: 'explore-hands-on',
  title: '动手实践',
  scenario: 'explore',
  icon: '🛠️',
  description: '设计可动手操作的探究项目',
  tags: ['实践', '动手', '项目'],
  template: '你是一位擅长项目式学习的名师。请围绕"{{knowledge_point}}"设计一个可动手操作的探究项目。\n\n目标学生：{{student_grade}}\n\n项目设计：\n1. **项目名称**：一个吸引人的名字\n2. **项目目标**：做完之后能学到什么？\n3. **材料清单**：家中或超市容易找到的材料（不超过 10 种）\n4. **制作步骤**：分步骤详细说明（配尺寸/用量）\n5. **原理解释**：用学生的语言解释背后的原理\n6. **拓展方向**：如果感兴趣，可以怎么改进？\n7. **安全提醒**：需要注意的安全事项\n\n请确保项目安全、可操作、有教育价值。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：大气压强、杠杆原理...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
