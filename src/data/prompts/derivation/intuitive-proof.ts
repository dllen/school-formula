import type { PromptTemplate } from '../types';

export const intuitiveProofPrompt: PromptTemplate = {
  id: 'deriv-intuitive',
  title: '直观理解',
  scenario: 'derivation',
  icon: '💡',
  description: '用直觉和实例帮助理解公式含义',
  tags: ['直观', '直觉', '理解'],
  template: '你是一位擅长直观教学的名师。请用直觉和实例帮助{{student_grade}}学生理解"{{formula}}"。\n\n理解框架：\n1. **直觉解释**：不证自明地"感觉"这个公式为什么是对的\n2. **具体实例**：用 2-3 个具体数字代入，看规律\n3. **类比联想**：这个公式和生活中的什么现象类似？\n4. **极限检验**：当某个变量趋于 0 或无穷大时，公式还合理吗？\n5. **量纲分析**：从单位/量纲角度验证公式的合理性\n6. **一句话总结**：用最简洁的语言说出这个公式的"灵魂"\n\n请避免直接给出证明，先用直觉"说服"学生。',
  variables: [
    { key: 'formula', label: '公式/定理', placeholder: '如：欧姆定律、三角形面积公式...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
