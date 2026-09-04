import type { PromptTemplate } from '../types';

export const gradientPrompt: PromptTemplate = {
  id: 'generate-gradient',
  title: '梯度出题',
  scenario: 'generate',
  icon: '📊',
  description: '生成基础/提高/挑战三档题目，附详细解析',
  tags: ['分层', '梯度', '系统性'],
  template: `你是一位命题经验丰富的{{student_grade}}{{subject}}名师。请围绕"{{knowledge_point}}"生成一套梯度练习题。

题目配置：
- 基础题 3 道（直接应用概念，确保信心）
- 提高题 2 道（需要一步转化或综合）
- 挑战题 1 道（需要多步推理或创新思维）

每道题包含：
1. 题目（清晰表述）
2. 解题步骤（详细、分步）
3. 答案与解析
4. 考查点标注

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保题目不超纲、表述规范、难度梯度合理。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：一元二次方程...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初三...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '', required: false, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
