import type { PromptTemplate } from '../types';

export const habitBuildingPrompt: PromptTemplate = {
  id: 'plan-habit-building',
  title: '习惯养成',
  scenario: 'plan',
  icon: '🌱',
  description: '培养良好学习习惯的 21 天计划',
  tags: ['习惯', '21天', '养成'],
  template: '你是一位擅长习惯培养的教育专家。请设计一份 21 天学习习惯养成计划。\n\n目标习惯：{{target_habit}}\n学生年级：{{student_grade}}\n当前情况：{{current_status}}\n\n21 天计划设计：\n1. **第 1-7 天（启动期）**：\n   - 最小可行行动（每天只需 5-10 分钟）\n   - 降低启动门槛\n   - 每日打卡追踪\n2. **第 8-14 天（适应期）**：\n   - 逐步增加难度/时长\n   - 加入变化保持新鲜感\n   - 每周小奖励\n3. **第 15-21 天（巩固期）**：\n   - 形成固定流程\n   - 自我监控取代外部监督\n   - 庆祝完成\n\n配套工具：\n- 每日打卡表\n- 家长监督指南\n- 遇到困难时的应对策略\n- 21 天后的维持方案',
  variables: [
    { key: 'target_habit', label: '目标习惯', placeholder: '如：每天做 5 道计算题、课前预习...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学四年级...', required: true, type: 'text' },
    { key: 'current_status', label: '当前情况', placeholder: '如：完全没习惯/偶尔做/坚持不下来...', required: true, type: 'textarea' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
