import type { PromptTemplate } from '../types';

export const metaCognitionPrompt: PromptTemplate = {
  id: 'error-meta-cognition',
  title: '元认知训练',
  scenario: 'error-analysis',
  icon: '🧘',
  description: '培养学生对自身思考的监控能力',
  tags: ['元认知', '自我监控', '高阶'],
  template: '你是一位擅长元认知训练的名师。请设计一套元认知训练方案，帮助学生学会监控自己的思考。\n\n题目：{{question}}\n学生答案：{{student_answer}}\n\n元认知训练设计：\n1. **做题前的思考**（计划）：\n   - 这道题考查什么知识点？\n   - 我打算用什么方法？\n   - 有什么需要注意的陷阱？\n2. **做题中的思考**（监控）：\n   - 我的每一步都有依据吗？\n   - 有没有其他可能？\n   - 如果卡住了怎么办？\n3. **做题后的思考**（评估）：\n   - 我的答案合理吗？\n   - 有没有检查？\n   - 我能在脑子里"复盘"整个过程吗？\n4. **错题反思模板**：引导学生建立错题反思的习惯\n5. **元认知提问清单**：日常可用的自我提问列表',
  variables: [
    { key: 'question', label: '题目', placeholder: '请输入题目...', required: true, type: 'textarea' },
    { key: 'student_answer', label: '学生答案', placeholder: '请输入学生的作答...', required: true, type: 'textarea' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
