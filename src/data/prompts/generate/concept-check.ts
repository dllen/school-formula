import type { PromptTemplate } from '../types';

export const conceptCheckPrompt: PromptTemplate = {
  id: 'generate-concept-check',
  title: '概念诊断',
  scenario: 'generate',
  icon: '🔬',
  description: '5 道精题快速诊断概念理解程度，定位薄弱点',
  tags: ['诊断', '快速', '定位薄弱'],
  template: `你是一位擅长学情诊断的名师。请针对"{{knowledge_point}}"设计一套 5 题概念诊断卷。

目标学生：{{student_grade}}

诊断设计：
- 第 1 题：概念识别（能否辨认）
- 第 2 题：概念理解（能否解释）
- 第 3 题：概念辨析（能否区分相似概念）
- 第 4 题：概念应用（能否解决简单问题）
- 第 5 题：概念迁移（能否解决变式问题）

每题后给出：
- 做对说明：该维度已掌握
- 做错说明：该维度需要加强 + 具体建议

最后给出整体评估：掌握程度（初阶/中阶/高阶）和后续学习建议。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：密度、函数单调性...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
