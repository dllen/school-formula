import type { PromptTemplate } from '../types';

export const experimentKitPrompt: PromptTemplate = {
  id: 'interact-experiment',
  title: '家庭实验',
  scenario: 'interaction',
  icon: '🧪',
  description: '用家庭材料设计简易实验',
  tags: ['实验', '材料易得', '安全'],
  template: '你是一位擅长家庭实验的名师。请利用家庭常见材料设计一个展示"{{knowledge_point}}"的实验。\n\n目标学生：{{student_grade}}\n\n实验设计：\n1. **实验名称**：一个吸引人的名字\n2. **实验原理**：用简单的语言解释\n3. **材料清单**：超市/厨房/文具店能买到的材料（附替代品）\n4. **安全提醒**：特别注意的安全事项\n5. **实验步骤**：分步骤详细说明（配预估时间）\n6. **观察重点**：需要仔细观察什么？\n7. **原理揭秘**：实验后如何给孩子解释原理？\n8. **拓展问题**：实验后可以问孩子的 3 个思考题\n\n请确保实验绝对安全、材料易得、现象明显。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：酸碱指示剂、大气压...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初一...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
