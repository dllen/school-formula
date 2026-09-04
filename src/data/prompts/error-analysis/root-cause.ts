import type { PromptTemplate } from '../types';

export const rootCausePrompt: PromptTemplate = {
  id: 'error-root-cause',
  title: '根因分析',
  scenario: 'error-analysis',
  icon: '🔍',
  description: '深挖错题的根本原因',
  tags: ['根因', '深度', '治本'],
  template: '你是一位擅长错题分析的名师。请对这道错题进行根因分析。\n\n题目：{{question}}\n学生答案：{{student_answer}}\n正确答案：{{correct_answer}}\n\n分析框架：\n1. **直接错误**：学生具体错在哪里？\n2. **错误类型**：\n   - 概念性错误（对概念理解有误）\n   - 计算性错误（计算过程出错）\n   - 方法性错误（选用方法不当）\n   - 审题性错误（理解题意有误）\n   - 习惯性错误（抄错、漏写等）\n3. **深层原因**：为什么会出现这个错误？（用"5 Why分析法"思路追问）\n4. **关联漏洞**：这个错误反映出哪些知识点的薄弱？\n5. **纠正策略**：如何从根本上解决这个问题？\n6. **预防方法**：以后如何避免同类错误？',
  variables: [
    { key: 'question', label: '题目', placeholder: '请输入题目...', required: true, type: 'textarea' },
    { key: 'student_answer', label: '学生答案', placeholder: '请输入学生的错误答案...', required: true, type: 'textarea' },
    { key: 'correct_answer', label: '正确答案', placeholder: '请输入正确答案...', required: true, type: 'textarea' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.9,
  author: '清北名师团队',
};
