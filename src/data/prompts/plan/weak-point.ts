import type { PromptTemplate } from '../types';

export const weakPointPrompt: PromptTemplate = {
  id: 'plan-weak-point',
  title: '弱项攻坚',
  scenario: 'plan',
  icon: '💪',
  description: '针对薄弱知识点的专项攻坚计划',
  tags: ['弱项', '专项', '突破'],
  template: '你是一位擅长针对性辅导的名师。请为"{{knowledge_point}}"制定专项攻坚计划。\n\n目标学生：{{student_grade}}\n当前问题：{{problem_description}}\n可用时间：{{available_time}}\n\n攻坚计划：\n1. **诊断测试**（10 分钟）：3 道题定位具体薄弱点\n2. **根因分析**：是概念不理解？还是不会应用？还是计算易错？\n3. **分步突破方案**：\n   - 第 1 步：概念重建（用什么方式讲清楚）\n   - 第 2 步：基础练习（3-5 道，确保能做对）\n   - 第 3 步：变式训练（2-3 道，检验是否真会）\n   - 第 4 步：综合应用（1-2 道，看能否迁移）\n4. **时间节点**：每天做什么、预期多久突破\n5. **检验标准**：用什么标准判定"已经突破"\n6. **防复发策略**：如何避免再次遗忘\n\n请确保计划针对性强、步骤清晰。',
  variables: [
    { key: 'knowledge_point', label: '薄弱知识点', placeholder: '如：分式方程应用题...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初三...', required: true, type: 'text' },
    { key: 'problem_description', label: '具体问题', placeholder: '如：遇到应用题不会列方程...', required: true, type: 'textarea' },
    { key: 'available_time', label: '可用时间', placeholder: '如：每天 30 分钟，共 2 周...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
