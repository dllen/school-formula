import type { PromptTemplate } from '../types';

export const adaptivePrompt: PromptTemplate = {
  id: 'generate-adaptive',
  title: '自适应出题',
  scenario: 'generate',
  icon: '🔄',
  description: '根据学生答题情况动态调整难度的出题策略',
  tags: ['自适应', '动态', '个性化'],
  template: `你是一位精通自适应学习的名师。请为"{{knowledge_point}}"设计一套自适应出题方案。

目标学生：{{student_grade}}，当前水平：{{current_level}}

自适应策略：
1. **初始评估**：3 道题快速定位学生水平
2. **动态调整规则**：
   - 连续 2 题正确 → 难度提升一档
   - 连续 2 题错误 → 难度降低一档 + 给出知识点复习提示
   - 1 对 1 错 → 保持当前难度
3. **终止条件**：连续 3 题正确（达标）或完成 10 题
4. **输出最终评估报告**：掌握度、薄弱点、建议

请生成初始 3 道评估题，并说明后续出题策略。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：因式分解...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
    { key: 'current_level', label: '当前水平', placeholder: '基础/中等/优秀', required: true, type: 'select', options: ['基础', '中等', '优秀'] },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
