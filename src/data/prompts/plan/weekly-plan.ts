import type { PromptTemplate } from '../types';

export const weeklyPlanPrompt: PromptTemplate = {
  id: 'plan-weekly',
  title: '周学习计划',
  scenario: 'plan',
  icon: '📅',
  description: '制定一周的每日学习安排',
  tags: ['周计划', '日常', '可执行'],
  template: '你是一位擅长学习规划的{{student_grade}}{{subject}}名师。请为孩子制定一份可执行的周学习计划。\n\n学习内容：{{knowledge_point}}\n当前水平：{{current_level}}\n每周可用时间：{{hours_per_week}} 小时\n\n计划要求：\n1. **周一到周五**：每天 15-30 分钟的微学习任务\n   - 具体任务（不是"复习数学"，而是"完成 5 道分式计算题"）\n   - 预估时间\n   - 检验方式\n2. **周六**：本周知识整合 + 错题回顾（45-60 分钟）\n3. **周日**：拓展应用或休息调整\n4. **弹性机制**：如果某天没完成，如何调整？\n5. **激励设计**：周末达成目标的小奖励建议\n\n请确保任务具体、时间合理、可操作性强。',
  variables: [
    { key: 'knowledge_point', label: '学习内容', placeholder: '如：一元二次方程...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初三...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
    { key: 'current_level', label: '当前水平', placeholder: '基础/中等/优秀', required: true, type: 'select', options: ['基础', '中等', '优秀'] },
    { key: 'hours_per_week', label: '每周可用时间（小时）', placeholder: '如：5、10...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
