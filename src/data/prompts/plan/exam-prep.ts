import type { PromptTemplate } from '../types';

export const examPrepPrompt: PromptTemplate = {
  id: 'plan-exam-prep',
  title: '备考计划',
  scenario: 'plan',
  icon: '🎯',
  description: '考前冲刺复习计划',
  tags: ['备考', '冲刺', '高效'],
  template: '你是一位备考经验丰富的{{student_grade}}{{subject}}名师。请制定一份考前冲刺计划。\n\n考试范围：{{knowledge_point}}\n距离考试：{{days_until_exam}} 天\n当前水平：{{current_level}}\n\n冲刺计划：\n1. **知识扫描**（前 1/3 时间）：\n   - 列出所有考点及其权重\n   - 标记掌握/薄弱/未学\n   - 薄弱点优先复习\n2. **专项突破**（中 1/3 时间）：\n   - 每个薄弱点配专项练习\n   - 难度从基础到提高\n   - 每日检测是否突破\n3. **模拟冲刺**（后 1/3 时间）：\n   - 限时模拟练习\n   - 错题回顾\n   - 考试策略指导\n4. **每日时间分配**：具体时间安排表\n5. **考前一天**：做什么、不做什么\n\n请确保计划紧凑高效、重点突出。',
  variables: [
    { key: 'knowledge_point', label: '考试范围', placeholder: '如：第一至三章...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初三...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
    { key: 'days_until_exam', label: '距离考试（天）', placeholder: '如：7、14、30...', required: true, type: 'text' },
    { key: 'current_level', label: '当前水平', placeholder: '基础/中等/优秀', required: true, type: 'select', options: ['基础', '中等', '优秀'] },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.9,
  author: '清北名师团队',
};
