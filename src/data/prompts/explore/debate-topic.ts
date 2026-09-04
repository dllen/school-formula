import type { PromptTemplate } from '../types';

export const debateTopicPrompt: PromptTemplate = {
  id: 'explore-debate',
  title: '辩论话题',
  scenario: 'explore',
  icon: '🎭',
  description: '围绕知识点设计辩论/讨论话题',
  tags: ['辩论', '批判思维', '表达'],
  template: '你是一位擅长思辨教学的名师。请围绕"{{knowledge_point}}"设计一个辩论/讨论话题。\n\n目标学生：{{student_grade}}\n\n辩论设计：\n1. **辩题**：一个有争议性、可辩论的命题\n2. **正方观点**：支持方的论据（至少 3 条）\n3. **反方观点**：反对方的论据（至少 3 条）\n4. **关键概念**：辩论中需要厘清的概念\n5. **评判标准**：如何判定哪方更有道理？\n6. **讨论延伸**：如果无法达成共识，还有什么角度？\n7. **家长引导**：如何引导讨论而不直接给答案？\n\n请确保辩题有教育价值，能锻炼批判思维。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：转基因、人工智能、克隆...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.5,
  author: '清北名师团队',
};
