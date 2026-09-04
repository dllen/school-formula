import type { PromptTemplate } from '../types';

export const extensionPrompt: PromptTemplate = {
  id: 'deriv-extension',
  title: '拓展延伸',
  scenario: 'derivation',
  icon: '🚀',
  description: '从基础公式拓展到更一般形式',
  tags: ['拓展', '延伸', '高阶'],
  template: '你是一位擅长拓展教学的名师。请从"{{formula}}"出发，拓展到更一般的形式。\n\n目标学生：{{student_grade}}\n\n拓展设计：\n1. **当前形式**：清晰表述目前的公式\n2. **特殊→一般**：这个公式是更一般结论的什么特殊情况？\n3. **推广方向**：可以从哪些角度推广？\n   - 维度变化（2D→3D）\n   - 条件放宽（特殊→一般）\n   - 类比迁移（A领域→B领域）\n4. **拓展后的形式**：用简洁语言描述推广后的结论\n5. **何时用拓展形式**：什么情况下需要用到更一般的形式？\n6. **思考问题**：给学生留下一个值得思考的拓展问题\n\n请确保拓展自然、不过度超纲，激发求知欲。',
  variables: [
    { key: 'formula', label: '基础公式/定理', placeholder: '如：一元二次方程求根公式...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
  ],
  grades: ['high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
