import type { PromptTemplate } from '../types';

export const visualProofPrompt: PromptTemplate = {
  id: 'deriv-visual',
  title: '图形证明',
  scenario: 'derivation',
  icon: '📐',
  description: '用图形/动画思路可视化证明公式',
  tags: ['图形', '可视化', '直觉'],
  template: '你是一位擅长可视化教学的名师。请用图形/动画思路可视化证明"{{formula}}"。\n\n目标学生：{{student_grade}}\n\n可视化设计：\n1. **图形描述**：详细描述一个能"看出"结论的图形\n2. **动画分解**：把这个图形的变换过程分步骤描述（像动画一样）\n3. **面积/长度对应**：图形中的哪部分对应公式中的哪一项？\n4. **Mermaid 图表**：用 Mermaid 语法绘制可视化图\n5. **动手验证**：学生可以用剪纸/画图来验证\n\n请确保图形简洁、证明直观，学生"一看就懂"。',
  variables: [
    { key: 'formula', label: '公式/定理', placeholder: '如：完全平方公式、勾股定理...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
