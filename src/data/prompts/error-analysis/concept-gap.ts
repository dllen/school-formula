import type { PromptTemplate } from '../types';

export const conceptGapPrompt: PromptTemplate = {
  id: 'error-concept-gap',
  title: '概念缺口',
  scenario: 'error-analysis',
  icon: '🕳️',
  description: '识别错题背后的概念理解漏洞',
  tags: ['概念', '漏洞', '补缺'],
  template: '你是一位擅长诊断学习漏洞的名师。请分析错题背后隐藏的概念缺口。\n\n题目：{{question}}\n学生答案：{{student_answer}}\n所涉知识点：{{knowledge_point}}\n\n分析框架：\n1. **解题所需的知识链**：列出解决这道题需要的所有前置概念\n2. **缺口定位**：学生在哪个概念环节出了问题？\n3. **缺口类型**：\n   - 完全没学过\n   - 学过但遗忘了\n   - 理解不完整\n   - 和其他概念混淆了\n4. **概念重建方案**：用简洁语言重新讲解这个概念\n5. **验证理解**：1 道题检验学生是否真正补上了这个缺口\n6. **知识网络修复**：这个概念和哪些其他概念有关联？',
  variables: [
    { key: 'question', label: '题目', placeholder: '请输入题目...', required: true, type: 'textarea' },
    { key: 'student_answer', label: '学生答案', placeholder: '请输入学生的错误答案...', required: true, type: 'textarea' },
    { key: 'knowledge_point', label: '所涉知识点', placeholder: '如：勾股定理...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
