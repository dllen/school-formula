import type { PromptTemplate } from '../types';

export const stepByStepPrompt: PromptTemplate = {
  id: 'deriv-step-by-step',
  title: '逐步推导',
  scenario: 'derivation',
  icon: '👣',
  description: '分步骤详细推导公式/定理',
  tags: ['逐步', '详细', '严谨'],
  template: '你是一位擅长公式推导的{{student_grade}}{{subject}}名师。请分步骤详细推导"{{formula}}"。\n\n推导要求：\n1. **出发点**：从哪些已知结论出发？\n2. **每一步**：\n   - 这一步做了什么？\n   - 为什么可以这样做？（依据是什么？）\n   - 这一步的难点在哪里？\n3. **关键步骤标注**：哪一步最关键？为什么？\n4. **常见卡点**：学生通常在哪一步卡住？如何讲清楚？\n5. **记忆技巧**：如何帮助记忆这个公式而不是死记？\n\n请确保每一步都有"因为...所以..."，逻辑链完整。',
  variables: [
    { key: 'formula', label: '公式/定理', placeholder: '如：二次函数顶点式、牛顿第二定律...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初三...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
