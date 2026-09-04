import type { PromptTemplate } from '../types';

export const crossDisciplinePrompt: PromptTemplate = {
  id: 'explore-cross-discipline',
  title: '跨学科融合',
  scenario: 'explore',
  icon: '🔗',
  description: '展示知识点与其他学科的联系',
  tags: ['跨学科', '融合', '视野'],
  template: '你是一位擅长跨学科教学的名师。请展示"{{knowledge_point}}"与其他学科的关联。\n\n目标学生：{{student_grade}}\n\n关联设计：\n1. **与数学的关联**（如果是理科知识点）：需要哪些数学工具？\n2. **与语文的关联**：相关的诗词、文章、典故\n3. **与历史的关联**：这个知识点的发现/发明对历史的影响\n4. **与艺术的关联**：音乐、美术中是否有相关的表现？\n5. **与体育的关联**：运动中的科学原理\n6. **综合项目**：设计一个融合多个学科的小项目\n\n请用思维导图的形式展示这些联系（用 Mermaid 语法）。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：对称、声波、水循环...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初一...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
