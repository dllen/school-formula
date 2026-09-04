import type { PromptTemplate } from '../types';

export const careerConnectionPrompt: PromptTemplate = {
  id: 'explore-career',
  title: '职业连接',
  scenario: 'explore',
  icon: '💼',
  description: '展示知识点与未来职业的联系',
  tags: ['职业', '未来', '激励'],
  template: '你是一位职业规划辅导名师。请展示"{{knowledge_point}}"与未来职业的联系。\n\n目标学生：{{student_grade}}\n\n职业展示：\n1. **直接相关的职业**：哪些职业直接使用这个知识点？\n2. **职业介绍**：每个职业的日常工作、所需技能、发展前景\n3. **代表人物**：这个领域的一位杰出人物（及其故事）\n4. **学习路径**：如果想从事这个职业，现在需要学好什么？\n5. **薪资与前景**：客观的职业信息（不过度美化）\n6. **给学生的建议**：现在可以做哪些准备？\n\n请确保信息客观准确，不夸大也不贬低任何职业。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：编程、力学、细胞...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
