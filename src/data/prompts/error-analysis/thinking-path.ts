import type { PromptTemplate } from '../types';

export const thinkingPathPrompt: PromptTemplate = {
  id: 'error-thinking-path',
  title: '思维路径',
  scenario: 'error-analysis',
  icon: '🧠',
  description: '还原学生解题的思维过程，找到卡点',
  tags: ['思维', '过程', '诊断'],
  template: '你是一位擅长思维诊断的名师。请还原学生解题的思维过程并找到卡点。\n\n题目：{{question}}\n学生答案：{{student_answer}}\n学生自述（可选）：{{student_thought}}\n\n分析框架：\n1. **思维路径还原**：\n   - 学生是从哪个角度切入的？\n   - 每一步推理是什么？\n   - 在哪里开始偏离正确方向？\n2. **卡点定位**：\n   - 具体卡在哪一步？\n   - 为什么会卡住？（知识盲点/思维定势/经验不足）\n3. **思维偏差类型**：\n   - 过度概括\n   - 遗漏条件\n   - 隐含假设错误\n   - 类比不当\n4. **思维纠正**：如何引导学生发现自己的思维偏差？\n5. **类似情境**：还有哪些题目容易触发同样的思维偏差？',
  variables: [
    { key: 'question', label: '题目', placeholder: '请输入题目...', required: true, type: 'textarea' },
    { key: 'student_answer', label: '学生答案', placeholder: '请输入学生的作答...', required: true, type: 'textarea' },
    { key: 'student_thought', label: '学生自述（选填）', placeholder: '学生对自己解题过程的描述...', required: false, type: 'textarea' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
