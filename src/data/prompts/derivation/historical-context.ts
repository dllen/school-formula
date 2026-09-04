import type { PromptTemplate } from '../types';

export const historicalContextPrompt: PromptTemplate = {
  id: 'deriv-historical',
  title: '历史背景',
  scenario: 'derivation',
  icon: '📜',
  description: '从数学史/科学史角度讲解公式发现过程',
  tags: ['历史', '背景', '人文'],
  template: '你是一位精通科学史的名师。请讲述"{{formula}}"背后的发现故事。\n\n目标学生：{{student_grade}}\n\n故事结构：\n1. **时代背景**：当时科学界面临什么问题？\n2. **发现者**：是谁发现的？他/她有什么特点？\n3. **发现过程**：\n   - 是什么现象引起了注意？\n   - 经历了哪些失败/曲折？\n   - 那个"尤里卡"时刻是什么样的？\n4. **当时争议**：这个发现一开始被接受了吗？\n5. **现代意义**：今天这个公式在哪里被使用？\n6. **给学生的启示**：从发现过程中能学到什么科学精神？\n\n请确保故事真实、生动，激发学生对科学的兴趣。',
  variables: [
    { key: 'formula', label: '公式/定理', placeholder: '如：勾股定理、万有引力定律...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
