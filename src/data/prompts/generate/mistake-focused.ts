import type { PromptTemplate } from '../types';

export const mistakeFocusedPrompt: PromptTemplate = {
  id: 'generate-mistake-focused',
  title: '易错题专项',
  scenario: 'generate',
  icon: '🎯',
  description: '针对常见易错点设计题目，让孩子在错误中学习',
  tags: ['易错', '避坑', '针对性'],
  template: `你是一位深谙学生易错点的名师。请针对"{{knowledge_point}}"的常见易错点设计专项练习。

目标学生：{{student_grade}}

题目设计：
1. 列出该知识点的 5 个典型易错点
2. 每个易错点配 1 道"陷阱题"（看似简单但容易做错）
3. 每道题详细解析"为什么会错"和"如何避免"
4. 最后出 2 道综合题检验是否真正掌握

请确保陷阱设计巧妙但不过分刁钻，目的是加深理解而非为难学生。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：分式方程、化学方程式...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初三...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
