import type { GradeLevel } from './knowledge';

export type PracticeQuestionType = 'choice' | 'fill';

export interface PracticeQuestion {
  id: string;
  grade: GradeLevel;
  subject: string;
  type: PracticeQuestionType;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ============ 小学 ============
  {
    id: 'primary-math-1',
    grade: 'primary',
    subject: '数学',
    type: 'choice',
    question: '一个长方形的长是 8 厘米，宽是 5 厘米，它的周长是多少厘米？',
    options: ['13 厘米', '26 厘米', '40 厘米', '21 厘米'],
    answer: '26 厘米',
    explanation: '长方形周长 = 2 × (长 + 宽) = 2 × (8 + 5) = 26 厘米。',
  },
  {
    id: 'primary-math-2',
    grade: 'primary',
    subject: '数学',
    type: 'choice',
    question: '汽车每小时行驶 60 千米，行驶 3 小时一共走了多少千米？',
    options: ['20 千米', '63 千米', '180 千米', '120 千米'],
    answer: '180 千米',
    explanation: '路程 = 速度 × 时间 = 60 × 3 = 180 千米。',
  },
  {
    id: 'primary-math-3',
    grade: 'primary',
    subject: '数学',
    type: 'fill',
    question: '一个圆的半径是 3 厘米，它的面积是 ____ 平方厘米。（π 取 3.14）',
    answer: '28.26',
    explanation: '圆的面积 = πr² = 3.14 × 3² = 3.14 × 9 = 28.26 平方厘米。',
  },
  {
    id: 'primary-math-4',
    grade: 'primary',
    subject: '数学',
    type: 'fill',
    question: '每支铅笔 2 元，买 15 支一共需要 ____ 元。',
    answer: '30',
    explanation: '总价 = 单价 × 数量 = 2 × 15 = 30 元。',
  },
  {
    id: 'primary-math-5',
    grade: 'primary',
    subject: '数学',
    type: 'choice',
    question: '边长为 6 分米的正方形，面积是多少平方分米？',
    options: ['12 平方分米', '24 平方分米', '36 平方分米', '18 平方分米'],
    answer: '36 平方分米',
    explanation: '正方形面积 = 边长 × 边长 = 6 × 6 = 36 平方分米。',
  },
  {
    id: 'primary-math-6',
    grade: 'primary',
    subject: '数学',
    type: 'choice',
    question: '计算 99 × 7 的简便结果是多少？',
    options: ['693', '697', '703', '690'],
    answer: '693',
    explanation: '99 × 7 = (100 - 1) × 7 = 700 - 7 = 693。',
  },
  // ============ 初中 ============
  {
    id: 'middle-math-1',
    grade: 'middle',
    subject: '数学',
    type: 'choice',
    question: '方程 x² - 5x + 6 = 0 的两个根是？',
    options: ['x=1, x=6', 'x=2, x=3', 'x=-2, x=-3', 'x=5, x=1'],
    answer: 'x=2, x=3',
    explanation: '因式分解：(x - 2)(x - 3) = 0，所以 x = 2 或 x = 3。',
  },
  {
    id: 'middle-math-2',
    grade: 'middle',
    subject: '数学',
    type: 'choice',
    question: '直角三角形两条直角边分别为 3 和 4，斜边长为？',
    options: ['5', '6', '7', '√7'],
    answer: '5',
    explanation: '由勾股定理：c = √(3² + 4²) = √25 = 5。',
  },
  {
    id: 'middle-math-3',
    grade: 'middle',
    subject: '数学',
    type: 'fill',
    question: '计算：(a + b)² = ____。',
    answer: 'a² + 2ab + b²',
    explanation: '完全平方公式：(a + b)² = a² + 2ab + b²。',
  },
  {
    id: 'middle-physics-1',
    grade: 'middle',
    subject: '物理',
    type: 'choice',
    question: '质量为 2 kg 的物体受到 10 N 的合外力，它的加速度是？',
    options: ['20 m/s²', '5 m/s²', '0.2 m/s²', '12 m/s²'],
    answer: '5 m/s²',
    explanation: '由牛顿第二定律 F = ma，得 a = F/m = 10/2 = 5 m/s²。',
  },
  {
    id: 'middle-physics-2',
    grade: 'middle',
    subject: '物理',
    type: 'fill',
    question: '一段电阻为 10 Ω 的导体两端电压为 20 V，通过它的电流是 ____ A。',
    answer: '2',
    explanation: '由欧姆定律 I = U/R = 20/10 = 2 A。',
  },
  {
    id: 'middle-math-4',
    grade: 'middle',
    subject: '数学',
    type: 'choice',
    question: '在直角三角形中，sin 30° 的值是？',
    options: ['√3/2', '1/2', '√2/2', '1'],
    answer: '1/2',
    explanation: '特殊角三角函数值：sin 30° = 1/2。',
  },
  // ============ 高中 ============
  {
    id: 'high-math-1',
    grade: 'high',
    subject: '数学',
    type: 'choice',
    question: '函数 f(x) = x³ 的导数是？',
    options: ['3x', '3x²', 'x²', '3x³'],
    answer: '3x²',
    explanation: "由幂函数求导公式 (xⁿ)' = n·xⁿ⁻¹，得 (x³)' = 3x²。",
  },
  {
    id: 'high-math-2',
    grade: 'high',
    subject: '数学',
    type: 'fill',
    question: '∫ 2x dx = ____。',
    answer: 'x² + C',
    explanation: '由积分公式 ∫ 2x dx = x² + C（C 为常数）。',
  },
  {
    id: 'high-math-3',
    grade: 'high',
    subject: '数学',
    type: 'choice',
    question: '向量 a = (1, 2)，b = (3, 4)，则 a · b = ？',
    options: ['7', '10', '11', '14'],
    answer: '11',
    explanation: 'a · b = x₁x₂ + y₁y₂ = 1×3 + 2×4 = 3 + 8 = 11。',
  },
  {
    id: 'high-math-4',
    grade: 'high',
    subject: '数学',
    type: 'choice',
    question: '袋中有 3 个红球、2 个白球，随机摸出 1 个球是红球的概率是？',
    options: ['2/5', '3/5', '1/2', '3/2'],
    answer: '3/5',
    explanation: '古典概型：P = 红球数 / 总球数 = 3/(3+2) = 3/5。',
  },
  {
    id: 'high-math-5',
    grade: 'high',
    subject: '数学',
    type: 'fill',
    question: '等差数列 1, 2, 3, …, 100 的前 100 项和 S₁₀₀ = ____。',
    answer: '5050',
    explanation: 'Sₙ = n(a₁ + aₙ)/2 = 100 × (1 + 100)/2 = 5050。',
  },
  {
    id: 'high-math-6',
    grade: 'high',
    subject: '数学',
    type: 'choice',
    question: '等比数列首项 a₁ = 1，公比 q = 2，前 4 项和 S₄ = ？',
    options: ['8', '15', '16', '31'],
    answer: '15',
    explanation: 'S₄ = a₁(1 - q⁴)/(1 - q) = (1 - 16)/(1 - 2) = 15。',
  },
];

export function getQuestionsByGrade(grade: GradeLevel): PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter((q) => q.grade === grade);
}
