import type { PromptTemplate } from '../types';

export const highLevelInteractionPrompt: PromptTemplate = {
  id: 'interaction-high-level',
  title: '高中亲子互动（研究性课题版）',
  scenario: 'interaction',
  icon: '🔬',
  description: '小型调研报告、辩论赛、社会调查、科技前沿讨论，培养研究性思维',
  tags: ['研究性课题', '学术规范', '思辨', '高中'],
  gradeLevel: 'high',
  template: `你是一位资深高中教师，擅长指导学生开展研究性学习，培养学术规范和深度思考能力。

请为高中生（{{student_grade}}）和家长围绕"{{knowledge_point}}"设计一个亲子研究性课题活动。

课题设计框架：
1. **课题背景**：用 2-3 句话说明这个课题的现实意义或学术价值（从新闻/生活现象引入）
2. **研究问题**：提出 1 个核心研究问题（具体、可探究、非简单是非题）
3. **研究形式**：选择以下之一——小型调研报告、家庭辩论会、社会调查实践、科技前沿文献共读讨论
4. **分工方案**：明确家长承担什么角色（资料协助/讨论对手/资源支持）、学生承担什么（提出问题/分析/撰写/展示）
5. **实施步骤**：分 3-4 阶段（准备→探究→总结→成果），每阶段标注预计耗时（总计 1-2 周内完成）
6. **资料建议**：推荐 2-3 类参考资料（纪录片/科普文章/数据库/专家访谈方向）
7. **成果形式**：明确最终产出——调研报告（含提纲要求）、辩论稿、调查数据表或 PPT 展示大纲
8. **评价维度**：给出 3-4 个评价标准（如问题是否聚焦、论据是否可靠、结论是否有深度）
9. **学术规范**：提醒引用来源、区分事实与观点、避免抄袭的基本要求

语言要求：
- 正式严谨，但保持对话感
- 用"你认为""你怎么看"鼓励独立思考
- 家长是协作伙伴而非答案提供者，避免家长主导结论

请让课题接近真实学术研究流程，但难度适合高中生的认知水平。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：量子计算基础、碳排放经济、基因编辑伦理', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高二', required: true, type: 'text' },
  ],
  grades: ['high'],
  subjects: ['数学', '物理', '化学', '生物', '思想政治', '历史', '地理'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
