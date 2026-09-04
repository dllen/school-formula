import type { PromptTemplate } from '../types';

export const milestonePrompt: PromptTemplate = {
  id: 'plan-milestone',
  title: '里程碑规划',
  scenario: 'plan',
  icon: '🏁',
  description: '学期/学年学习目标和里程碑',
  tags: ['里程碑', '目标', '长期规划'],
  template: '你是一位擅长长期学习规划的名师。请制定一份学期/学年学习里程碑规划。\n\n学生年级：{{student_grade}}\n学科：{{subject}}\n当前水平：{{current_level}}\n目标水平：{{target_level}}\n\n里程碑规划：\n1. **学期目标**：用具体、可衡量的语言描述\n2. **月度里程碑**（每月 1 个关键成果）：\n   - 第 1 月：...\n   - 第 2 月：...\n   - ...\n3. **每周任务**：每月里程碑拆解为每周可执行任务\n4. **检测方式**：每个里程碑如何验证是否达成\n5. **调整机制**：如果落后了怎么追赶？如果超前了如何拓展？\n6. **激励设计**：每个里程碑达成后的庆祝方式\n\n请确保目标既有挑战性又可达成，里程碑清晰可衡量。',
  variables: [
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
    { key: 'current_level', label: '当前水平', placeholder: '如：班级中等...', required: true, type: 'text' },
    { key: 'target_level', label: '目标水平', placeholder: '如：班级前 10...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
