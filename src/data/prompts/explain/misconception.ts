import type { PromptTemplate } from '../types';

export const misconceptionPrompt: PromptTemplate = {
  id: 'explain-misconception',
  title: '常见误解剖析',
  scenario: 'explain',
  icon: '⚠️',
  description: '针对学生常见错误概念进行正误对比，防患于未然',
  tags: ['误解分析', '正误对比', '预防性'],
  template: `你是一位深谙学生思维误区的名师。请针对"{{knowledge_point}}"进行误解剖析。

目标学生：{{student_grade}}

剖析结构：
1. **正确理解**：用简洁语言准确表述概念
2. **5 个常见误解**：
   - 误解内容（学生通常怎么想错的）
   - 错误原因（为什么会这样想）
   - 正确纠正（如何讲清楚）
   - 检验问题（一题辨对错）
3. **教学建议**：家长如何提前预防这些误解
4. **诊断测试**：3 道判断题用于检测孩子是否有这些误解

请确保分析基于真实学情，不要编造不存在的"误解"。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：质量与重量、0.9循环=1...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
