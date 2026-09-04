import type { PromptTemplate } from '../types';

export const frontierSciencePrompt: PromptTemplate = {
  id: 'explore-frontier',
  title: '前沿科学',
  scenario: 'explore',
  icon: '🔬',
  description: '介绍知识点在前沿科学中的应用',
  tags: ['前沿', '科学', '激发'],
  template: '你是一位关注前沿科学的名师。请介绍"{{knowledge_point}}"在前沿科学中的应用。\n\n目标学生：{{student_grade}}\n\n前沿展示：\n1. **基础知识回顾**：简洁复习这个知识点的核心\n2. **前沿领域**：这个知识在哪些前沿领域有应用？\n   - 人工智能\n   - 量子计算\n   - 生物技术\n   - 航天工程\n   - 新能源\n3. **具体案例**：一个真实的前沿科技案例\n4. **科学家故事**：这个领域的一位代表性科学家\n5. **未来展望**：10-20 年后，这个领域会发展到哪里？\n6. **给学生的建议**：如果感兴趣，现在可以做哪些准备？\n\n请用通俗的语言解释前沿概念，不堆砌术语。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：概率、电磁感应、细胞分裂...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.9,
  author: '清北名师团队',
};
