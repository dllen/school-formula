import type { PromptTemplate } from '../types';

export const transferPracticePrompt: PromptTemplate = {
  id: 'error-transfer-practice',
  title: '变式迁移',
  scenario: 'error-analysis',
  icon: '🔄',
  description: '通过变式题检验是否真正掌握',
  tags: ['变式', '迁移', '举一反三'],
  template: '你是一位擅长变式教学的名师。请基于学生的错题设计变式练习。\n\n原题：{{question}}\n学生错误：{{student_answer}}\n\n变式设计：\n1. **数据变式**：只改数据，考查是否会做同样的题\n2. **条件变式**：改变一个条件，看学生能否适应\n3. **逆向变式**：从结论反推条件\n4. **情境变式**：换一个新情境，考查迁移能力\n5. **综合变式**：融合多个知识点\n\n每道变式题包含：\n- 题目\n- 解题提示（如果学生又卡住了）\n- 详细解析\n- 与原题的关联说明\n\n最后给出一个总体判断：学生是"真的会了"还是"只是记住了答案"。',
  variables: [
    { key: 'question', label: '原题', placeholder: '请输入题目...', required: true, type: 'textarea' },
    { key: 'student_answer', label: '学生错误', placeholder: '请输入学生的错误答案...', required: true, type: 'textarea' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
