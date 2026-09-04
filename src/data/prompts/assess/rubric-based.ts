import type { PromptTemplate } from '../types';

export const rubricBasedPrompt: PromptTemplate = {
  id: 'assess-rubric-based',
  title: '量规评分',
  scenario: 'assess',
  icon: '📏',
  description: '按评分量规给出分维度评价和总分',
  tags: ['量规', '分维度', '客观'],
  template: '你是一位{{student_grade}}{{subject}}名师。请按以下评分量规对学生作答进行评价。\n\n题目：{{question}}\n\n学生答案：{{student_answer}}\n\n评分量规：\n1. **知识理解**（0-3分）：是否准确理解题目涉及的概念和原理\n2. **解题过程**（0-3分）：解题步骤是否完整、逻辑是否清晰\n3. **计算准确性**（0-2分）：计算过程是否正确、结果是否准确\n4. **表达规范性**（0-2分）：书写是否规范、术语使用是否正确\n\n请给出：\n- 每个维度的得分和扣分原因\n- 总分（满分10分）\n- 等级评定（优秀/良好/合格/需改进）\n- 各维度的改进建议',
  variables: [
    { key: 'question', label: '题目', placeholder: '请输入题目内容...', required: true, type: 'textarea' },
    { key: 'student_answer', label: '学生答案', placeholder: '请输入学生作答内容...', required: true, type: 'textarea' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
