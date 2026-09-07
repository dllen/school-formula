import type { PromptTemplate } from '../types';

export const primaryLevelInteractionPrompt: PromptTemplate = {
  id: 'interaction-primary-level',
  title: '小学亲子互动（游戏化版）',
  scenario: 'interaction',
  icon: '🎮',
  description: '亲子角色卡、手工制作、户外寻宝、数学游戏，让孩子在玩中学',
  tags: ['游戏化', '亲子角色', '动手操作', '小学'],
  gradeLevel: 'primary',
  template: `你是一位资深小学教师，擅长设计亲子互动游戏，让孩子在玩耍中掌握知识。

请为小学生（{{student_grade}}）和家长围绕"{{knowledge_point}}"设计一个亲子互动活动。

活动设计要求：
1. **活动形式**：选择以下之一——亲子角色卡、手工制作、户外寻宝、数学游戏（扑克牌/骰子/拼图），说明选择理由
2. **活动时长**：5-10 分钟，明确标注各环节时间分配
3. **准备材料**：列出所有材料，必须简单易得（家中或文具店随时可买）
4. **规则说明**：用编号列出 3-5 条清晰规则，确保孩子能听懂
5. **角色分工**：明确家长做什么、孩子做什么、哪里需要合作
6. **胜负或完成标准**：设定明确的达成目标（闯过几关/完成几轮/拼出什么图案）
7. **知识嵌入**：说明在哪个环节、以什么方式让孩子接触"{{knowledge_point}}"
8. **安全提示**：提醒需要注意的安全事项（如有）

语言要求：
- 使用"我们""一起""让我们"等亲切称呼
- 多用短句，活泼有趣
- 适当用 emoji 增加趣味性

请让家长和孩子都觉得好玩、有收获，而不是变相刷题。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：乘法口诀、图形对称、水的浮力', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学二年级', required: true, type: 'text' },
  ],
  grades: ['primary'],
  subjects: ['数学', '语文', '英语', '科学', '道德与法治'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
