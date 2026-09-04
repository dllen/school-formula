import type { PromptTemplate } from '../types';

export const oralDefensePrompt: PromptTemplate = {
  id: 'assess-oral-defense',
  title: '口述答辩',
  scenario: 'assess',
  icon: '🎤',
  description: '通过口述方式检验理解深度',
  tags: ['口述', '理解深度', '表达能力'],
  template: '你是一位擅长口述答辩评估的名师。请设计一套"口述答辩"方案，通过让学生讲解来检验理解深度。\n\n学习内容：{{knowledge_point}}\n目标学生：{{student_grade}}\n\n答辩方案设计：\n1. **热身问题**（1 个）：简单问题让学生进入状态\n2. **核心问题**（3 个）：\n   - "请用自己的话解释这个概念"（理解）\n   - "举一个生活中的例子"（应用）\n   - "如果...会怎样？"（迁移）\n3. **追问策略**：每个问题后的深入追问方向\n4. **评价标准**：\n   - 准确性：表述是否正确\n   - 深度：是否触及本质\n   - 灵活性：能否举一反三\n5. **家长引导提示**：如何追问、如何判断孩子是否真懂\n\n请确保问题能区分"死记硬背"和"真正理解"。',
  variables: [
    { key: 'knowledge_point', label: '学习内容', placeholder: '如：光合作用...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初一...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
