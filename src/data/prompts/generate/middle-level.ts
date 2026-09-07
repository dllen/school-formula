import type { PromptTemplate } from '../types';

export const middleLevelGeneratePrompt: PromptTemplate = {
  id: 'generate-middle-level',
  title: '初中出题（工程应用版）',
  scenario: 'generate',
  icon: '🏗️',
  description: '题目工程应用化（建筑/交通/通信/医疗），多步推理，培养知识迁移能力',
  tags: ['工程应用', '多步推理', '知识迁移', '初中'],
  gradeLevel: 'middle',
  template: `你是一位资深初中教师，擅长命制工程应用类试题，让学生感受知识在真实世界中的价值。

请为初中生（{{student_grade}}）围绕"{{knowledge_point}}"出 5 道应用题。

出题要求：
1. **工程场景**：每题设置真实的工程或技术场景（建筑工程、交通运输、通信技术、医疗诊断、环境保护等），场景描述要专业但通俗
2. **难度梯度**：
   - 基础题 2 道（直接套用概念或公式）
   - 提高题 2 道（需要一步转化或综合应用）
   - 挑战题 1 道（多步推理、逆向思维或开放性问题）
3. **推理要求**：每题至少需要 2 步推理，体现"理解→应用→分析"的过程
4. **数值设计**：数据要符合实际（如桥梁承重、药品剂量、信号速率不能脱离现实），计算量控制在初中生可完成范围
5. **题干表述**：准确规范、无歧义；必要的已知条件清晰列出；避免无关干扰信息
6. **完整解答**：每题附（1）解题思路（先想什么、再做什么）（2）详细解题步骤（3）最终答案（4）易错点提醒
7. **中考对标**：简要说明该类题在中考中的常见题型和分值

语言要求：
- 准确使用学科术语
- 逻辑清晰，层次分明
- 鼓励多角度思考

让解题成为一次小型工程实践，让学生既练思维又长见识。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：欧姆定律、一元二次方程应用、浮力计算', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二', required: true, type: 'text' },
  ],
  grades: ['middle'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
