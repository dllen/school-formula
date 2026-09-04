import type { PromptTemplate } from '../types';

export const quizBattlePrompt: PromptTemplate = {
  id: 'interact-quiz',
  title: '知识问答赛',
  scenario: 'interaction',
  icon: '⚔️',
  description: '设计亲子知识抢答游戏',
  tags: ['竞赛', '抢答', '趣味'],
  template: '你是一位擅长游戏教学的名师。请设计一套亲子知识抢答游戏，围绕"{{knowledge_point}}"。\n\n目标学生：{{student_grade}}\n\n游戏设计：\n1. **准备阶段**：\n   - 家长需要做什么准备？\n   - 需要制作什么道具？\n2. **游戏规则**：抢答规则、计分规则\n3. **题目设计**（10 道）：\n   - 必答题 3 道（基础）\n   - 抢答题 4 道（中等）\n   - 风险题 3 道（挑战，可选择是否作答）\n4. **奖惩机制**：赢了的奖励、输了的小惩罚（趣味性）\n5. **加时赛**：平局怎么办？\n6. **变体玩法**：可以怎么改变规则增加趣味？\n\n请确保规则公平、难度适中、氛围轻松。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：古诗词、几何...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学五年级...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
