import type { PromptTemplate } from '../types';

export const summerPlanPrompt: PromptTemplate = {
  id: 'plan-summer',
  title: '假期规划',
  scenario: 'plan',
  icon: '🏖️',
  description: '寒暑假长期学习规划',
  tags: ['假期', '长期', '劳逸结合'],
  template: '你是一位擅长长期学习规划的名师。请为孩子制定一份{{break_type}}学习规划。\n\n年级：{{student_grade}}\n薄弱科目：{{weak_subjects}}\n新学期重点：{{next_term_focus}}\n\n规划框架：\n1. **恢复期**（前 3-5 天）：调整作息，回顾上学期重点\n2. **巩固期**（第 1-2 周）：\n   - 每天 30 分钟复习上学期薄弱点\n   - 每周 1 次综合检测\n3. **预习期**（中间 2-3 周）：\n   - 新学期重点知识的预习\n   - 不求精通，建立整体认知\n4. **拓展期**（穿插进行）：\n   - 阅读、实验、项目式学习\n   - 保持学习兴趣\n5. **收心期**（开学前 1 周）：\n   - 调整作息到上学模式\n   - 新学期目标设定\n\n每日时间表模板 + 弹性调整机制 + 劳逸结合建议。',
  variables: [
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
    { key: 'break_type', label: '假期类型', placeholder: '暑假/寒假', required: true, type: 'select', options: ['暑假', '寒假'] },
    { key: 'weak_subjects', label: '薄弱科目', placeholder: '如：数学物理...', required: true, type: 'text' },
    { key: 'next_term_focus', label: '新学期重点', placeholder: '如：初三中考冲刺...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
