import type { PromptTemplate } from '../types';

export const visualExplainPrompt: PromptTemplate = {
  id: 'explain-visual',
  title: '可视化讲解',
  scenario: 'explain',
  icon: '🎨',
  description: '用思维导图/流程图/对比表等可视化方式呈现知识结构',
  tags: ['可视化', '思维导图', '结构化'],
  template: `你是一位擅长可视化教学的名师。请用多种可视化方式呈现"{{knowledge_point}}"的知识结构。

目标学生：{{student_grade}}

可视化要求：
1. **思维导图**：用 Mermaid 语法绘制知识点的思维导图
2. **核心公式/规则**：用表格清晰呈现（含含义和单位）
3. **对比表**：与易混淆概念进行对比（至少 3 个维度）
4. **流程图**：用 Mermaid 语法制订解题步骤流程图

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保 Mermaid 语法正确可渲染，适合家长打印出来辅导孩子。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：勾股定理、化学反应速率...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '', required: false, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
