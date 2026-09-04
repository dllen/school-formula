import type { PromptTemplate } from '../types';

export const bridgeAnalogyPrompt: PromptTemplate = {
  id: 'explain-bridge-analogy',
  title: '桥梁类比法',
  scenario: 'explain',
  icon: '🌉',
  description: '用已知知识搭建理解新概念的桥梁，从熟悉到陌生',
  tags: ['类比', '脚手架', '建构主义'],
  template: `你是一位擅长用类比教学的名师。请用"桥梁类比法"讲解"{{knowledge_point}}"。

目标学生：{{student_grade}}

讲解结构：
1. **起点**：从学生已知的"{{known_concept}}"出发
2. **搭桥**：找到已知概念与新概念的 3 个连接点
3. **过河**：通过连接点逐步引出新概念的核心
4. **验收**：用 2 道题检验学生是否真正理解
5. **延伸**：这个类比在哪里会"失效"？（避免过度类比）

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保类比准确、不误导，适合家长辅导使用。`,
  variables: [
    { key: 'knowledge_point', label: '新知识点', placeholder: '如：负数、电流、被动语态...', required: true, type: 'text' },
    { key: 'known_concept', label: '已知的类比概念', placeholder: '如：温度、水流、主动语态...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初一...', required: true, type: 'text' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '', required: false, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '英语'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
