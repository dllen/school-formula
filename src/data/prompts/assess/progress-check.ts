import type { PromptTemplate } from '../types';

export const progressCheckPrompt: PromptTemplate = {
  id: 'assess-progress-check',
  title: '阶段检测',
  scenario: 'assess',
  icon: '📈',
  description: '单元/阶段知识掌握情况检测',
  tags: ['检测', '阶段性', '查漏补缺'],
  template: '你是一位擅长学情诊断的{{student_grade}}{{subject}}名师。请围绕"{{knowledge_point}}"设计一套阶段检测方案。\n\n检测设计：\n1. **知识点清单**：列出本单元所有核心知识点\n2. **分层检测题**：\n   - 基础过关（3 道）：覆盖所有核心知识点\n   - 综合应用（2 道）：跨知识点综合\n   - 拓展挑战（1 道）：需要高阶思维\n3. **掌握度判定标准**：\n   - 全部正确：优秀 ✓✓✓\n   - 基础全对+综合部分对：良好 ✓✓\n   - 基础部分对：合格 ✓\n   - 基础多错：需要补习 ✗\n4. **薄弱点定位**：错题对应到具体知识点\n5. **补救方案**：每个薄弱点配 1 道补救题\n\n请确保检测覆盖全面、难度梯度合理。',
  variables: [
    { key: 'knowledge_point', label: '单元知识点', placeholder: '如：第一单元 有理数...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初一...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
