import type { PromptTemplate } from '../types';

export const storyBasedPrompt: PromptTemplate = {
  id: 'explain-story-based',
  title: '故事化讲解',
  scenario: 'explain',
  icon: '📚',
  description: '用完整的故事情节串联知识点，让学习像听故事一样有趣',
  tags: ['故事教学', '情境学习', '趣味'],
  template: `你是一位擅长用故事讲知识的名师。请围绕"{{knowledge_point}}"创作一个生动的教学故事。

目标学生：{{student_grade}}

故事要求：
1. 故事主角是一个与学生年龄相仿的孩子
2. 故事自然引入"{{knowledge_point}}"概念
3. 通过主角的探索/困难/发现来展现知识点的本质
4. 故事结束后总结核心知识点
5. 设计一个"故事续写"小任务，让学生运用所学

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}

请保持故事趣味性，适合家长讲给孩子听。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：分数的乘法、浮力...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学三年级...', required: true, type: 'text' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '如：科幻背景、历史故事...', required: false, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物', '历史'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
