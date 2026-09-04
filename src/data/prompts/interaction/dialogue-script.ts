import type { PromptTemplate } from '../types';

export const dialogueScriptPrompt: PromptTemplate = {
  id: 'interact-dialogue',
  title: '对话脚本',
  scenario: 'interaction',
  icon: '💬',
  description: '编写家长与孩子的辅导对话脚本',
  tags: ['对话', '脚本', '实操'],
  template: '你是一位擅长亲子沟通的名师。请编写一份家长辅导"{{knowledge_point}}"的对话脚本。\n\n目标学生：{{student_grade}}\n\n对话脚本：\n1. **开场**：如何自然地引入学习话题（不说"来学习"）\n2. **引导对话**：\n   - 家长说什么（用提问代替讲解）\n   - 孩子可能的回答\n   - 针对不同回答的应对策略\n3. **关键转折点**：当孩子卡住时，家长说什么？\n4. **总结收尾**：如何自然地结束，让孩子有成就感\n5. **家长注意事项**：\n   - 避免说的话（"这么简单都不会"）\n   - 推荐说的话（"你的思路很有意思"）\n6. **备选方案**：如果孩子不配合怎么办？\n\n请确保对话自然、可操作，家长"照搬"就能用。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：分数除法、时态...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学五年级...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
