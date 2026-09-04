import type { PromptTemplate } from '../types';

export const peerReviewPrompt: PromptTemplate = {
  id: 'assess-peer-review',
  title: '互评引导',
  scenario: 'assess',
  icon: '🤝',
  description: '引导学生互相批改、学习他人思路',
  tags: ['互评', '合作', '多元视角'],
  template: '你是一位擅长合作学习的名师。请设计一份"同伴互评指南"，引导学生互相批改作业。\n\n题目：{{question}}\n\n学生答案A：{{answer_a}}\n\n学生答案B：{{answer_b}}\n\n互评指南设计：\n1. **评分标准**：给出清晰的打分规则（让学生能操作）\n2. **亮点发现**：每个答案至少找出 2 个值得学习的地方\n3. **问题指出**：用"我建议..."代替"你错了"\n4. **思路对比**：比较两种解法的异同，哪个更巧妙？\n5. **改进建议**：针对每个答案给出具体的优化方向\n6. **反思问题**："从同学的解法中学到了什么？"\n\n请确保互评标准具体可操作，适合{{student_grade}}学生使用。',
  variables: [
    { key: 'question', label: '题目', placeholder: '请输入题目内容...', required: true, type: 'textarea' },
    { key: 'answer_a', label: '学生A答案', placeholder: '第一位同学的作答...', required: true, type: 'textarea' },
    { key: 'answer_b', label: '学生B答案', placeholder: '第二位同学的作答...', required: true, type: 'textarea' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
