import type { PromptTemplate } from '../types';

export const socraticPrompt: PromptTemplate = {
  id: 'explain-socratic',
  title: '苏格拉底式提问',
  scenario: 'explain',
  icon: '🤔',
  description: '通过连环提问引导学生自主发现知识，不给答案',
  tags: ['苏格拉底法', '引导发现', '高阶思维'],
  template: `你是一位精通苏格拉底教学法的名师。请针对"{{knowledge_point}}"设计一套连环提问。

目标学生：{{student_grade}}

提问设计原则：
1. 第一层：回忆与激活（你已经知道什么？）
2. 第二层：理解与解释（这是什么意思？用自己的话说）
3. 第三层：应用与迁移（如果...会怎样？）
4. 第四层：分析与比较（这和...有什么不同？为什么？）
5. 第五层：评价与创造（你能设计一个新例子吗？）

每层 2-3 个问题，层层递进，环环相扣。
每个问题后给出"家长引导提示"——当孩子卡住时如何启发。

{{#if prior_knowledge}}
学生已掌握：{{prior_knowledge}}
{{/if}}

请记住：不要直接给答案！用提问引导孩子自己发现。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：光合作用、方程...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初一、高二...', required: true, type: 'text' },
    { key: 'prior_knowledge', label: '前置知识（选填）', placeholder: '学生已掌握的相关知识...', required: false, type: 'textarea' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物', '历史'],
  usageCount: 0,
  rating: 4.9,
  author: '清北名师团队',
};
