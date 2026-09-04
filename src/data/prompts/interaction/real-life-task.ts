import type { PromptTemplate } from '../types';

export const realLifeTaskPrompt: PromptTemplate = {
  id: 'interact-real-life',
  title: '生活任务',
  scenario: 'interaction',
  icon: '🏠',
  description: '设计将知识应用到生活中的亲子任务',
  tags: ['生活', '任务', '实用'],
  template: '你是一位擅长生活教育的名师。请设计一个亲子任务，让孩子在生活中应用"{{knowledge_point}}"。\n\n目标学生：{{student_grade}}\n\n任务设计：\n1. **任务名称**：一个有趣的任务名\n2. **任务背景**：为什么要做这个任务？\n3. **任务目标**：完成之后能学到什么？\n4. **任务步骤**：\n   - 准备（5 分钟）\n   - 执行（15-30 分钟）\n   - 记录（拍照/笔记）\n   - 总结（讨论）\n5. **所需材料**：家庭常见物品\n6. **家长角色**：在任务中家长应该做什么？\n7. **反思问题**：任务后一起讨论的问题\n8. **成果展示**：任务成果可以怎么展示/保存？\n\n请确保任务安全、可操作、让孩子感到"学了真有用"。',
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：统计、测量、分类...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学四年级...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
