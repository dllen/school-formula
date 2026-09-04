import type { PromptTemplate } from '../types';

export const challengePrompt: PromptTemplate = {
  id: 'generate-challenge',
  title: '思维挑战',
  scenario: 'generate',
  icon: '🏆',
  description: '设计开放性、探究性的高阶思维题目，培养创新能力',
  tags: ['挑战', '开放', '高阶思维'],
  template: `你是一位擅长培养学生高阶思维的名师。请围绕"{{knowledge_point}}"设计思维挑战题。

目标学生：{{student_grade}}

挑战题设计：
1. **开放探究题**（1 道）：条件开放或结论开放，需要学生自己探索
2. **实际建模题**（1 道）：将知识点应用到真实情境中建模求解
3. **跨学科题**（1 道）：融合其他学科知识解决问题

每题包含：
- 题目（情境化、有挑战但可解）
- 解题思路提示（分层次：金钥匙→银钥匙→铜钥匙）
- 参考解答
- 拓展思考（如果改变某个条件会怎样？）

请确保题目有"跳一跳够得着"的难度，激发思考而非打击信心。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：概率、能量守恒...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.9,
  author: '清北名师团队',
};
