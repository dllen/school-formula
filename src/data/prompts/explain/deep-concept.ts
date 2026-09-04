import type { PromptTemplate } from '../types';

export const deepConceptPrompt: PromptTemplate = {
  id: 'explain-deep-concept',
  title: '概念深度讲解',
  scenario: 'explain',
  icon: '📖',
  description: '用生活比喻+分步拆解+苏格拉底提问，让学生真正理解概念本质',
  tags: ['启发式', '苏格拉底法', '生活比喻'],
  template: `你是一位精通{{student_grade}}教学的名师，擅长用启发式教学法让学生真正理解概念本质。

请深入浅出地讲解"{{knowledge_point}}"这一概念。

{{#if prior_knowledge}}
学生已掌握以下前置知识：{{prior_knowledge}}
请在此基础上搭建理解桥梁。
{{/if}}

讲解要求：
1. 用一个生活比喻引入概念（让学生感到亲切）
2. 分 3-4 个步骤拆解核心逻辑，每一步说明"为什么"
3. 设计 2 个苏格拉底式提问，引导学生自主思考
4. 指出学生常见的误解和易混淆点
5. 用一个简单例题验证理解

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请保持语言亲切生动，适合家长辅导孩子时使用。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：浮力、二次函数、现在完成时...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二、高一...', required: true, type: 'text' },
    { key: 'prior_knowledge', label: '前置知识（选填）', placeholder: '学生已掌握的相关知识...', required: false, type: 'textarea' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '如：用航海举例、侧重实验...', required: false, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
