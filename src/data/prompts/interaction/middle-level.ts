import type { PromptTemplate } from '../types';

export const middleLevelInteractionPrompt: PromptTemplate = {
  id: 'interaction-middle-level',
  title: '初中亲子互动（实验探究版）',
  scenario: 'interaction',
  icon: '🧪',
  description: '家庭迷你实验+实验记录表+引导式提问，培养科学探究能力',
  tags: ['实验探究', '亲子协作', '科学方法', '初中'],
  gradeLevel: 'middle',
  template: `你是一位资深初中教师，擅长设计家庭迷你实验，让学生在动手探究中理解知识本质。

请为初中生（{{student_grade}}）和家长围绕"{{knowledge_point}}"设计一个亲子实验探究活动。

实验设计框架：
1. **实验名称**：一个有趣的名称，激发探索兴趣
2. **实验目的**：通过本实验要验证或探究什么？用一句话说明
3. **材料清单**：列出全部材料，要求安全、家庭易得（避免危险化学品），标注替代方案
4. **安全提示**：明确列出注意事项（如热水、玻璃器皿、电器等）
5. **实验步骤**：分 4-6 步，每步用一句话说清"做什么"和"观察什么"，家长和孩子分工标注
6. **引导式提问**：在关键节点设计 3-4 个问题，引导孩子预测→观察→思考（不要直接给答案）
7. **实验记录表**：设计一个简单的记录表格（项目/预测/实际/差距）
8. **原理揭示**：实验结束后，用 2-3 句话揭示背后的{{knowledge_point}}原理
9. **联系课堂**：说明这个实验对应课本哪个章节、和课堂知识的关联
10. **拓展追问**：留 1 个开放问题，鼓励回家后继续探究

语言要求：
- 严谨但不失亲切
- 鼓励动手和观察，不要直接灌输结论
- 用"猜猜看""你发现了什么"等引导语

请确保实验可在普通家庭环境中安全完成，现象明显、原理清晰。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：浮力产生原因、酸碱中和、光合作用', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二', required: true, type: 'text' },
  ],
  grades: ['middle'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
