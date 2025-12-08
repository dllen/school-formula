export type GradeLevel = 'primary' | 'middle' | 'high';

export interface KnowledgePoint {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

export interface Subject {
  id: string;
  name: string;
  icon?: string; // Optional icon name or emoji
  knowledgePoints: KnowledgePoint[];
}

export interface GradeData {
  id: GradeLevel;
  name: string;
  subjects: Subject[];
}

export const KNOWLEDGE_DATA: GradeData[] = [
  {
    id: 'primary',
    name: '小学',
    subjects: [
      {
        id: 'math-primary',
        name: '数学',
        icon: '🔢',
        knowledgePoints: [
          { id: 'p-math-1', title: '加减法', description: '100以内加减法运算规则与技巧。' },
          { id: 'p-math-2', title: '乘法口诀', description: '九九乘法表及其应用。' },
          { id: 'p-math-3', title: '分数初步', description: '分数的认识、比较大小与简单加减。' },
        ]
      },
      {
        id: 'chinese-primary',
        name: '语文',
        icon: '📝',
        knowledgePoints: [
          { id: 'p-chi-1', title: '拼音', description: '声母、韵母、声调的正确读法与拼写。' },
          { id: 'p-chi-2', title: '古诗词', description: '教育部推荐小学生必背古诗75首。' },
        ]
      },
       {
        id: 'english-primary',
        name: '英语',
        icon: '🔤',
        knowledgePoints: [
          { id: 'p-eng-1', title: '基础单词', description: '日常生活中常见的颜色、动物、水果单词。' },
          { id: 'p-eng-2', title: '简单句型', description: 'Hello, My name is..., How are you? 等基础对话。' },
        ]
      }
    ]
  },
  {
    id: 'middle',
    name: '初中',
    subjects: [
      {
        id: 'math-middle',
        name: '数学',
        icon: '📐',
        knowledgePoints: [
          { id: 'm-math-1', title: '有理数', description: '正数、负数、数轴、绝对值。' },
          { id: 'm-math-2', title: '一元一次方程', description: '方程的解法与应用题。' },
          { id: 'm-math-3', title: '几何图形', description: '三角形、平行四边形、圆的性质与证明。' },
        ]
      },
      {
        id: 'physics-middle',
        name: '物理',
        icon: '⚡',
        knowledgePoints: [
          { id: 'm-phy-1', title: '力学基础', description: '牛顿第一定律，重力，摩擦力。' },
          { id: 'm-phy-2', title: '光学', description: '光的反射、折射定律，透镜成像。' },
        ]
      },
      {
        id: 'chemistry-middle',
        name: '化学',
        icon: '🧪',
        knowledgePoints: [
          { id: 'm-chem-1', title: '元素周期表', description: '前20号元素及其符号。' },
          { id: 'm-chem-2', title: '化学反应', description: '化合反应、分解反应、置换反应、复分解反应。' },
        ]
      }
    ]
  },
  {
    id: 'high',
    name: '高中',
    subjects: [
      {
        id: 'math-high',
        name: '数学',
        icon: '∫',
        knowledgePoints: [
          { id: 'h-math-1', title: '集合与函数', description: '函数的性质、定义域、值域，单调性。' },
          { id: 'h-math-2', title: '导数', description: '导数的几何意义，利用导数研究函数。' },
          { id: 'h-math-3', title: '立体几何', description: '空间点线面的位置关系，体积表面积计算。' },
        ]
      },
      {
        id: 'physics-high',
        name: '物理',
        icon: '⚛️',
        knowledgePoints: [
          { id: 'h-phy-1', title: '牛顿运动定律', description: '受力分析，牛顿第二定律综合应用。' },
          { id: 'h-phy-2', title: '电磁学', description: '库仑定律，电场强度，磁场对电流的作用。' },
        ]
      },
       {
        id: 'history-high',
        name: '历史',
        icon: '🏺',
        knowledgePoints: [
          { id: 'h-his-1', title: '中国古代史', description: '秦汉大一统，唐宋经济繁荣，明清专制强化。' },
          { id: 'h-his-2', title: '世界近现代史', description: '新航路开辟，工业革命，两次世界大战。' },
        ]
      }
    ]
  }
];
