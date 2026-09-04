import type { PromptTemplate } from '../types';

export const storyCoCreatePrompt: PromptTemplate = {
  id: 'interact-story',
  title: '故事共创',
  scenario: 'interaction',
  icon: '📝',
  description: '家长和孩子一起创作教学故事',
  tags: ['共创', '想象', '表达'],
  template: '你是一位擅长创意写作的名师。请提供一个"故事共创"方案，让家长和孩子一起创作一个包含"{{knowledge_point}}"的教学故事。\n\n目标学生：{{student_grade}}\n\n共创方案：\n1. **故事开头**：提供一个吸引人的开头\n2. **角色设定**：2-3 个有趣的配角\n3. **情节框架**：故事的大致走向（但留出创作空间）\n4. **知识融入点**：在故事的哪个环节自然引入知识点\n5. **互动问题**：写作过程中家长可以问孩子的问题\n6. **结局选择**：提供 2-3 种不同风格的结局方向\n7. **展示方式**：故事完成后可以怎么"展示"？\n\n请提供开头和框架，但留出足够空间让孩子发挥创意。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：分数、植物生长...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学三年级...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle'],
  subjects: ['数学', '语文', '英语', '科学'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
