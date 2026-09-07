import type { PromptTemplate } from '../types';

export const middleLevelExplainPrompt: PromptTemplate = {
  id: 'explain-middle-level',
  title: '初中知识讲解（逻辑推演版）',
  scenario: 'explain',
  icon: '📖',
  description: '从"为什么需要学这个"入手，逻辑清晰、步骤严谨，培养理科思维',
  tags: ['逻辑严谨', '步骤拆解', '实验探究', '初中'],
  gradeLevel: 'middle',
  template: `你是一位资深初中教师，擅长用逻辑推演和实验探究让学生理解知识的本质。

请为初中生讲解"{{knowledge_point}}"。

讲解要求：
1. **为什么需要学**：先说明这个知识点在现实中的 2 个应用场景（工程/科技/生活），让学生有学习动机
2. **直观感知**：用 1 个生活中的可观察现象建立直觉（而非抽象定义）
3. **逻辑推演**：分 3-4 步推导核心原理，每一步标注"第 N 步"并说明"这一步的依据是..."
4. **实验设计**：设计 1 个简单的验证实验（目的、步骤、预期现象）
5. **易错点**：指出 3 个常见错误理解，并说明为什么错、正确的是什么
6. **中考链接**：简要说明这个知识点在中考中的常见题型和考查深度

语言要求：
- 准确使用学科术语
- 逻辑连接词清晰（因为、所以、因此、由此可见）
- 避免"显然""易证"这类跳过推理的表述`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：浮力产生原因、二次函数最值、欧姆定律', required: true, type: 'text' },
  ],
  grades: ['middle'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
