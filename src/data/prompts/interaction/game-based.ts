import type { PromptTemplate } from '../types';

export const gameBasedPrompt: PromptTemplate = {
  id: 'interact-game',
  title: '游戏化学习',
  scenario: 'interaction',
  icon: '🎲',
  description: '设计一个亲子学习游戏',
  tags: ['游戏', '趣味', '互动'],
  template: '你是一位擅长游戏化教学的名师。请围绕"{{knowledge_point}}"设计一个亲子学习游戏。\n\n目标学生：{{student_grade}}\n\n游戏设计：\n1. **游戏名称**：一个吸引人的名字\n2. **游戏目标**：通过游戏掌握什么知识/技能？\n3. **游戏材料**：需要什么道具？（尽量用家庭常见物品）\n4. **游戏规则**：清晰、简洁的规则说明\n5. **玩法规则**：具体怎么玩？分步骤说明\n6. **难度调整**：如何根据孩子水平调整难度？\n7. **获胜条件**：怎么算赢？有没有奖励机制？\n8. **教育原理**：这个游戏为什么能帮孩子学习？\n\n请确保游戏安全、有趣、真正有教育价值（不是披着游戏皮的刷题）。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：乘法口诀、几何图形...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学二年级...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.9,
  author: '清北名师团队',
};
