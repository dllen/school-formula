import type { PromptTemplate } from '../types';

export const selfAssessmentPrompt: PromptTemplate = {
  id: 'assess-self-assessment',
  title: '自我反思',
  scenario: 'assess',
  icon: '🪞',
  description: '引导学生自我检查和反思学习过程',
  tags: ['元认知', '反思', '自主学习'],
  template: '你是一位擅长培养元认知能力的名师。请设计一套引导学生自我反思的问卷和指南。\n\n学习内容：{{knowledge_point}}\n目标学生：{{student_grade}}\n\n反思指南设计：\n1. **知识自查清单**（5 个问题）：学生可以自问自答，检查是否真正掌握\n2. **思维过程回顾**：\n   - 我是怎么想到这个解法的？\n   - 有没有其他方法？\n   - 这个方法和之前学的有什么联系？\n3. **自我评价表**：让学生从"理解深度""应用能力""表达规范"三个维度自评\n4. **错因分析框架**：如果做错了，是哪个环节出了问题？\n5. **下一步计划**：基于自评，制定 2-3 条具体的改进措施\n\n请确保反思问题能引导学生深入思考，而非简单回答"会了/没会"。',
  variables: [
    { key: 'knowledge_point', label: '学习内容', placeholder: '如：勾股定理、化学反应速率...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
