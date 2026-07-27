import type { GradeLevel } from './knowledge';

export interface MentalMathMnemonic {
  id: string;
  title: string;
  rhyme: string;
  scene: string;
  example: string;
  explanation?: string;
  tags: string[];
}

const PRIMARY_MNEMONICS: MentalMathMnemonic[] = [
  {
    id: 'primary-make-ten',
    title: '凑十法',
    rhyme: '看大数，分小数，凑成十，加剩数。',
    scene: '20 以内进位加法',
    example: '8 + 5 = 8 + 2 + 3 = 10 + 3 = 13',
    explanation: '把较小的数拆成两部分，使其中一部分与较大的数凑成 10，再加剩余部分。',
    tags: ['加法', '低年级', '进位'],
  },
  {
    id: 'primary-break-ten',
    title: '破十法',
    rhyme: '分被减，先减十，再加剩，得结果。',
    scene: '20 以内退位减法',
    example: '15 - 8 = 10 - 8 + 5 = 2 + 5 = 7',
    explanation: '把被减数拆成 10 和几，先用 10 去减，再加上剩余部分。',
    tags: ['减法', '低年级', '退位'],
  },
  {
    id: 'primary-level-ten',
    title: '平十法',
    rhyme: '看减数，分小数，平到十，再减完。',
    scene: '20 以内退位减法',
    example: '13 - 5 = 13 - 3 - 2 = 10 - 2 = 8',
    explanation: '把减数拆成两部分，先将被减数减到 10，再用 10 减剩余部分。',
    tags: ['减法', '低年级', '退位'],
  },
  {
    id: 'primary-times-5',
    title: '乘 5 速算',
    rhyme: '乘五就是折一半，末尾添零很简单。',
    scene: '任意整数 × 5',
    example: '24 × 5 = 24 ÷ 2 × 10 = 12 × 10 = 120',
    explanation: '乘以 5 等价于先除以 2 再乘以 10。',
    tags: ['乘法', '中年级'],
  },
  {
    id: 'primary-times-25',
    title: '乘 25 速算',
    rhyme: '乘二十五折四折，后面添上两个零。',
    scene: '任意整数 × 25',
    example: '36 × 25 = 36 ÷ 4 × 100 = 9 × 100 = 900',
    explanation: '乘以 25 等价于先除以 4 再乘以 100。',
    tags: ['乘法', '中年级'],
  },
  {
    id: 'primary-times-125',
    title: '乘 125 速算',
    rhyme: '乘一百二十五，除以八再乘千。',
    scene: '任意整数 × 125',
    example: '88 × 125 = 88 ÷ 8 × 1000 = 11 × 1000 = 11000',
    explanation: '乘以 125 等价于先除以 8 再乘以 1000。',
    tags: ['乘法', '高年级'],
  },
  {
    id: 'primary-head-same-tail-ten',
    title: '头同尾合十',
    rhyme: '头乘头加一，尾乘尾连一起。',
    scene: '十位数相同、个位数相加为 10 的两位数乘法',
    example: '43 × 47 = (4 × 5) × 100 + (3 × 7) = 2021',
    explanation: '结果前段为「十位数字 × (十位数字 + 1)」，后段为「个位数字相乘」（不足两位补零）。',
    tags: ['乘法', '高年级'],
  },
  {
    id: 'primary-times-11',
    title: '两位数乘 11',
    rhyme: '两边一拉，中间相加，满十进一。',
    scene: '任意两位数 × 11',
    example: '36 × 11 = 3 (3+6) 6 = 396；68 × 11 = 7 (6+8 的个位) 8 = 748',
    explanation: '把两位数的两个数字拉开，中间放它们之和；若和满十则向百位进一。',
    tags: ['乘法', '高年级'],
  },
  {
    id: 'primary-near-whole',
    title: '接近整十整百的加减',
    rhyme: '多加就减，少加再加；多减就加，少减再减。',
    scene: '凑整简便运算',
    example: '298 + 137 = 300 + 137 - 2 = 435',
    explanation: '把接近整十、整百的数先按整十、整百算，再调整差值。',
    tags: ['加减法', '高年级', '简便运算'],
  },
  {
    id: 'primary-squares-1-10',
    title: '1-10 平方数',
    rhyme: '一一一二一，二二得四记心里；三三得九四十六，五五二十五不疑。',
    scene: '常见平方数记忆',
    example: '7² = 49，8² = 64，9² = 81，10² = 100',
    explanation: '熟练掌握 1 到 10 的平方数，为后续估算和公式速算打基础。',
    tags: ['平方数', '高年级'],
  },
];

const MIDDLE_MNEMONICS: MentalMathMnemonic[] = [
  {
    id: 'middle-squares-11-19',
    title: '11-19 平方数',
    rhyme: '底加个位写前头，个位平方补后头。',
    scene: '11 到 19 的平方速算',
    example: '17² = (17 + 7) × 10 + 7² = 240 + 49 = 289',
    explanation: '设个位为 b，则 (10 + b)² = (10 + b + b) × 10 + b²。',
    tags: ['平方数', '代数'],
  },
  {
    id: 'middle-tail-five-square',
    title: '末位是 5 的平方',
    rhyme: '十位数乘它比它大一，后面直接写二十五。',
    scene: '个位为 5 的两位数平方',
    example: '35² = 3 × 4 × 100 + 25 = 1225；75² = 7 × 8 × 100 + 25 = 5625',
    explanation: '设十位为 a，则 (10a + 5)² = a(a + 1) × 100 + 25。',
    tags: ['平方数', '代数'],
  },
  {
    id: 'middle-difference-squares',
    title: '平方差公式速算',
    rhyme: '两数和乘两数差，等于平方之差。',
    scene: '两数相乘可写成 (a+b)(a-b) 形式',
    example: '53 × 47 = (50 + 3)(50 - 3) = 50² - 3² = 2500 - 9 = 2491',
    explanation: '利用 a² - b² = (a + b)(a - b)，把复杂乘法转化为平方差。',
    tags: ['乘法', '代数', '公式'],
  },
  {
    id: 'middle-perfect-square',
    title: '完全平方速算',
    rhyme: '首平方，尾平方，两倍首尾放中央。',
    scene: '两位数平方展开',
    example: '48² = 40² + 2 × 40 × 8 + 8² = 1600 + 640 + 64 = 2304',
    explanation: '利用 (a + b)² = a² + 2ab + b²。',
    tags: ['平方数', '代数', '公式'],
  },
  {
    id: 'middle-fraction-split',
    title: '分数裂项',
    rhyme: '一分之一减二分之一，裂成相邻单位差。',
    scene: '分母为相邻整数乘积的分数求和',
    example: '1/(2×3) + 1/(3×4) = (1/2 - 1/3) + (1/3 - 1/4) = 1/2 - 1/4 = 1/4',
    explanation: '利用 1/[n(n+1)] = 1/n - 1/(n+1) 进行裂项相消。',
    tags: ['分数', '求和', '代数'],
  },
  {
    id: 'middle-estimation',
    title: '估算技巧',
    rhyme: '四舍五入取整十，先估后算误差知。',
    scene: '快速估算乘除、加减结果',
    example: '48 × 32 ≈ 50 × 30 = 1500（实际 1536）',
    explanation: '把参与运算的数四舍五入到最近的整十、整百，简化计算。',
    tags: ['估算', '应用'],
  },
  {
    id: 'middle-percentage',
    title: '百分数速算',
    rhyme: '百分之一先除百，几倍乘几很简单。',
    scene: '常见百分数（10%、25%、50%、75% 等）',
    example: '25% × 80 = 80 ÷ 4 = 20；75% × 80 = 80 × 3 ÷ 4 = 60',
    explanation: '把百分数转化为熟悉的分数，再进行乘除。',
    tags: ['百分数', '应用'],
  },
];

const HIGH_MNEMONICS: MentalMathMnemonic[] = [
  {
    id: 'high-binomial-approx',
    title: '二项式近似',
    rhyme: 'x 很小可忽略，(1+x)^n ≈ 1+nx。',
    scene: '|x| 很小时的近似计算',
    example: '1.02³ ≈ 1 + 3 × 0.02 = 1.06',
    explanation: '当 x 接近 0 时，(1 + x)ⁿ ≈ 1 + nx，用于估算增长、复利等。',
    tags: ['近似', '二项式', '函数'],
  },
  {
    id: 'high-log-estimate',
    title: '对数估算',
    rhyme: 'lg2 零点三，lg3 零点四七，lg5 零点七，lg7 零点八五记心头。',
    scene: '常用对数估算',
    example: 'lg 6 = lg 2 + lg 3 ≈ 0.30 + 0.47 = 0.77',
    explanation: '记住常用质数的对数值，利用对数运算法则拆分估算。',
    tags: ['对数', '估算', '函数'],
  },
  {
    id: 'high-trig-special',
    title: '三角函数特殊角',
    rhyme: '三十四五六十度，正弦余弦要记熟。',
    scene: '特殊角的三角函数值',
    example: 'sin 30° = 1/2，cos 45° = √2/2，tan 60° = √3',
    explanation: '熟练掌握 30°、45°、60° 等特殊角的三角函数值。',
    tags: ['三角函数', '特殊角'],
  },
  {
    id: 'high-complex-modulus',
    title: '复数模的估算',
    rhyme: '实方加虚方，开方是模长。',
    scene: '复数 z = a + bi 的模',
    example: '|3 + 4i| = √(3² + 4²) = 5',
    explanation: '复数模等于实部平方与虚部平方之和的算术平方根。',
    tags: ['复数', '模', '代数'],
  },
  {
    id: 'high-limit-quick',
    title: '极限速判',
    rhyme: '分子分母比次数，高次决定趋无穷。',
    scene: '有理函数 x→∞ 的极限',
    example: 'lim (3x² + 2x)/(5x² - 1) = 3/5',
    explanation: '比较分子分母最高次项的次数与系数。',
    tags: ['极限', '微积分'],
  },
];

export const MENTAL_MATH_DATA: Record<GradeLevel, MentalMathMnemonic[]> = {
  primary: PRIMARY_MNEMONICS,
  middle: MIDDLE_MNEMONICS,
  high: HIGH_MNEMONICS,
};

export function getMentalMathByGrade(grade: GradeLevel): MentalMathMnemonic[] {
  return MENTAL_MATH_DATA[grade];
}
