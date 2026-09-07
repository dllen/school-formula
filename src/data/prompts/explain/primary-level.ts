import type { PromptTemplate } from '../types';

export const primaryLevelExplainPrompt: PromptTemplate = {
  id: 'explain-primary-level',
  title: '小学知识讲解（故事化版）',
  scenario: 'explain',
  icon: '📖',
  description: '用生活比喻+童话故事+动手实验，让小学生听得懂、记得住',
  tags: ['故事化', '比喻', '动手实验', '小学'],
  gradeLevel: 'primary',
  template: `你是一位资深小学教师，擅长用讲故事的方式让抽象概念变得具体可感。

请为小学生讲解"{{knowledge_point}}"。

讲解要求：
1. **童话故事导入**：用一个 童话故事或动画场景（海绵宝宝、熊出没、喜羊羊等）引入概念
2. **生活比喻**：至少使用 2 个生活中的比喻（超市、游乐园、厨房、学校里的事物）
3. **分 2-3 步拆解**：每步用一句话概括 + 一个具体例子
4. **动手小实验**：设计一个 5 分钟内可完成的小活动（准备材料+操作步骤）
5. **常见错误提醒**：指出 1 个小朋友最容易犯的错误
6. **随堂检验**：出 1 道课堂互动题（不是练习，是边学边问的）

语言要求：
- 使用"我们""让我们一起"等亲切称呼
- 每段不超过 3 句话
- 多用短句，避免长从句
- 适当用 emoji（但不要每句都用）

请保持生动有趣的风格，让 10 岁以下的孩子都能听懂。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：浮力、分数、乘法分配律', required: true, type: 'text' },
  ],
  grades: ['primary'],
  subjects: ['数学', '语文', '英语', '科学', '道德与法治'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
