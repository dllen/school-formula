import type { PromptTemplate } from '../types';

export const highLevelGeneratePrompt: PromptTemplate = {
  id: 'generate-high-level',
  title: '高中出题（综合建模版）',
  scenario: 'generate',
  icon: '🚀',
  description: '题目科技前沿化（AI/航天/基因/新能源），综合建模，体现学科思维深度',
  tags: ['科技前沿', '综合建模', '学科深度', '高中'],
  gradeLevel: 'high',
  template: `你是一位资深高中教师，擅长命制体现学科本质和科技前沿的综合建模试题，命题风格对标高考压轴题和强基校测。

请为高中生（{{student_grade}}）围绕"{{knowledge_point}}"出 5 道综合题。

出题要求：
1. **前沿场景**：每题设置科技前沿或科学研究情境（人工智能、航天工程、基因编辑、新能源技术、量子计算等），提供必要的背景信息，场景描述严谨专业
2. **难度梯度**：
   - 基础题 1 道（单一概念的理解和应用）
   - 提高题 2 道（需要综合多个知识点或数学建模）
   - 挑战题 2 道（跨知识模块综合、开放性探究、或需构造性思维，对标高考压轴题水平）
3. **建模要求**：每题需建立数学模型或逻辑模型，体现"实际问题→抽象→求解→验证"的完整思维链
4. **信息完整性**：题干给出充分且必要的条件和数据（含必要的物理常数、化学式量等）；避免冗余无关信息
5. **解题过程**：每题附（1）建模思路（如何建立模型）（2）完整求解过程（关键步骤）（3）最终答案或结论（4）思维延伸（可追问什么）
6. **学科思维**：在最后一题后，用 2-3 句话点评本组题体现了哪些学科思想方法（如：函数与方程、分类讨论、数形结合、极限思想）

语言要求：
- 术语精确，逻辑严密
- 符号表达规范（数学式、化学方程式、物理量符号）
- 题干信息完整、表述无歧义

让试题成为一次前沿探索，激发学生的求知欲和挑战精神。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：导数与优化、电磁感应综合、化学平衡移动', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高二', required: true, type: 'text' },
  ],
  grades: ['high'],
  subjects: ['数学', '物理', '化学', '生物', '思想政治', '历史', '地理'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
