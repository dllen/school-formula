import type { PromptTemplate } from '../types';

export const historySciencePrompt: PromptTemplate = {
  id: 'explore-history-science',
  title: '科学史话',
  scenario: 'explore',
  icon: '📖',
  description: '讲述知识发现背后的科学史故事',
  tags: ['科学史', '故事', '人文'],
  template: '你是一位精通科学史的名师。请讲述"{{knowledge_point}}"发现过程中的精彩故事。\n\n目标学生：{{student_grade}}\n\n故事结构：\n1. **时代背景**：当时人们的认知是什么？\n2. **关键人物**：谁做出了关键贡献？他/她的生平趣事\n3. **发现过程**：\n   - 偶然发现还是刻意探索？\n   - 遇到了哪些困难？\n   - 有哪些有趣的"插曲"？\n4. **当时争议**：这个发现一开始被接受了吗？\n5. **对今天的影响**：改变了什么？\n6. **思考讨论**：从故事中学到了什么科学精神？\n\n请确保故事有据可查、生动有趣。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：DNA 结构、电磁感应...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
