import type { PromptTemplate } from '../types';

export const primaryLevelGeneratePrompt: PromptTemplate = {
  id: 'generate-primary-level',
  title: '小学出题（趣味生活版）',
  scenario: 'generate',
  icon: '🎪',
  description: '题目场景生活化（超市/游乐园/家庭/学校），题型趣味化，让孩子做题像闯关',
  tags: ['生活场景', '趣味化', '基础+挑战', '小学'],
  gradeLevel: 'primary',
  template: `你是一位资深小学教师，擅长把练习题包装成孩子感兴趣的生活场景，让孩子在做题中感受知识的力量。

请为小学生（{{student_grade}}）围绕"{{knowledge_point}}"出 5 道练习题。

出题要求：
1. **场景化题干**：每道题设置一个生活场景（超市购物、游乐园、家庭厨房、学校课堂等），孩子读题就像读小故事
2. **难度梯度**：
   - 基础题 2 道（直接应用概念，确保信心）
   - 中等题 2 道（需要一步思考或转化）
   - 挑战题 1 道（需要两步思考或逆向思维）
3. **题型搭配**：至少包含选择题、判断题、填空题中的 2 种（如：2 选择 + 2 判断 + 1 填空）
4. **题干要求**：简短清晰，小学生一读就懂；避免复杂从句；贴合孩子生活经验
5. **数值范围**：数字和计算量适合该年级水平（如小学三年级以内不超过三位数加减、表内乘除）
6. **答案与解析**：每题附（1）正确答案（2）1-2 句话解析，说清"为什么是这个答案"
7. **鼓励语**：最后附一句鼓励孩子的话（具体、真诚，不空洞）

语言要求：
- 题干生动有趣，多用口语化表达
- 鼓励孩子思考："你知道为什么吗""试试看"
- 避免说教口吻

让做题像闯关游戏，让孩子愿意做、做完还想做。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：乘法口诀、分数初步、认识人民币', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学三年级', required: true, type: 'text' },
  ],
  grades: ['primary'],
  subjects: ['数学', '语文', '英语', '科学', '道德与法治'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
