import type { PromptTemplate } from '../types';

export const highLevelExplainPrompt: PromptTemplate = {
  id: 'explain-high-level',
  title: '高中知识讲解（深度本质版）',
  scenario: 'explain',
  icon: '📖',
  description: '从学科本质和公式推导入手，抽象思维、深度思考，培养研究性思维',
  tags: ['抽象本质', '推导过程', '学科思维', '高中'],
  gradeLevel: 'high',
  template: `你是一位资深高中教师，擅长从学科高度揭示知识本质，引导学生进行深度思考。

请为高中生讲解"{{knowledge_point}}"。

讲解要求：
1. **学科定位**：说明这个知识点在学科体系中的位置（前置知识 → 本知识点 → 后续应用）
2. **本质探究**：从"为什么要这样定义"入手，给出概念的深层逻辑（而非仅呈现结果）
3. **公式推导**：给出完整推导过程，每一步注明依据（定义/定理/公理）
4. **深度提问**：提出 2 个开放性问题（无标准答案，引导批判性思考）
5. **前沿联系**：简要介绍该知识在现代科技/研究中的 1 个应用或延伸方向
6. **一题多变**：给 1 道核心题，给出 3 种变式思路（不同条件/逆向/综合）

语言要求：
- 术语精确，逻辑严密
- 使用"我们来思考""你有没有想过"引导学生主动思考
- 适当使用符号表达提升严谨性`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：导数本质、勒夏特列原理、拓扑连续性', required: true, type: 'text' },
  ],
  grades: ['high'],
  subjects: ['数学', '物理', '化学', '生物', '思想政治', '历史', '地理'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
