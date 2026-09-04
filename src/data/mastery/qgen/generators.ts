import type { Question } from '../types';
import { rand, generateOptions, generateNumOptions } from './utils';

function Q(q: string, opts: string[], ans: number, level: number, explain: string, point: string): Question {
  return { q, opts, ans, level, explain, point };
}

// ========== 小学 ==========

function qCount(): Question {
  const n = rand(1, 20);
  const arr = Array.from({ length: n }, () => '●').join('');
  const { opts, ans } = generateNumOptions(n);
  return Q(`数一数，下图中有几个●？\n${arr}`, opts, ans, 1, `一个一个地数，一共有 ${n} 个。`, '数数与数位');
}

function qAddSub(): Question {
  const a = rand(10, 50);
  const b = rand(10, 50);
  const isAdd = Math.random() > 0.5;
  const answer = isAdd ? a + b : Math.max(a, b) - Math.min(a, b);
  const { opts, ans } = generateNumOptions(answer);
  return Q(`${a} ${isAdd ? '+' : '-'} ${b} = ？`, opts, ans, 1, isAdd ? `${a} + ${b} = ${answer}` : `${a} - ${b} = ${answer}`, '100以内加减法');
}

function qMulti(): Question {
  const a = rand(2, 9);
  const b = rand(2, 9);
  const answer = a * b;
  const { opts, ans } = generateNumOptions(answer);
  return Q(`${a} × ${b} = ？`, opts, ans, 1, `${a} × ${b} = ${answer}`, '乘法口诀');
}

function qDivide(): Question {
  const b = rand(2, 9);
  const answer = rand(2, 9);
  const a = b * answer;
  const { opts, ans } = generateNumOptions(answer);
  return Q(`${a} ÷ ${b} = ？`, opts, ans, 1, `${a} ÷ ${b} = ${answer}（${b} × ${answer} = ${a}）`, '表内除法');
}

function qFourops(): Question {
  const type = rand(0, 2);
  if (type === 0) {
    const a = rand(1, 9), b = rand(1, 9);
    const { opts, ans } = generateNumOptions(3 + a * b);
    return Q(`3 + ${a} × ${b} = ？`, opts, ans, 1, `先乘：${a}×${b}=${a*b}，再 3+${a*b}=${3+a*b}`, '先乘除后加减');
  } else if (type === 1) {
    const a = rand(1, 9), b = rand(1, 9);
    const { opts, ans } = generateNumOptions((3 + a) * b);
    return Q(`(${3} + ${a}) × ${b} = ？`, opts, ans, 1, `先括号：${3+a}×${b}=${(3+a)*b}`, '括号优先');
  } else {
    const a = rand(10, 40), b = rand(1, 9);
    const { opts, ans } = generateNumOptions(Math.floor(a / b));
    return Q(`${Math.floor(a / b) * b} ÷ ${b} = ？`, opts, ans, 1, `${Math.floor(a / b) * b}÷${b}=${Math.floor(a / b)}`, '除法');
  }
}

function qPlant(): Question {
  const len = rand(10, 50);
  const gap = rand(2, 5);
  const count = Math.floor(len / gap);
  const { opts, ans } = generateNumOptions(count + 1);
  return Q(`一条 ${len} 米小路，每隔 ${gap} 米栽一棵树，两端都栽，共几棵？`, opts, ans, 1, `间隔数=${len}÷${gap}=${count}，两端都栽：${count}+1=${count+1} 棵`, '植树问题');
}

function qSumdiff(): Question {
  const big = rand(20, 50);
  const small = rand(5, big - 5);
  const sum = big + small;
  const diff = big - small;
  const { opts, ans } = generateNumOptions(big);
  return Q(`两数和为 ${sum}，差为 ${diff}，大数是？`, opts, ans, 1, `(${sum}+${diff})÷2=${big}`, '和差公式');
}

function qAverage(): Question {
  const a = rand(60, 100);
  const b = rand(60, 100);
  const c = rand(60, 100);
  const avg = Math.round((a + b + c) / 3);
  const { opts, ans } = generateNumOptions(avg);
  return Q(`三数 ${a}、${b}、${c} 的平均数是？`, opts, ans, 1, `(${a}+${b}+${c})÷3=${avg}`, '平均数');
}

function qFraction(): Question {
  const d = rand(2, 8);
  const n1 = rand(1, d - 1);
  const n2 = rand(1, d - 1);
  const { opts, ans } = generateNumOptions(n1 + n2);
  return Q(`${n1}/${d} + ${n2}/${d} = ？`, opts, ans, 1, `同分母分数相加，分母不变分子相加：${n1}/${d} + ${n2}/${d} = ${n1 + n2}/${d}`, '分数加法');
}

// ========== 初中 ==========

function qRational(): Question {
  const a = rand(-9, 9);
  const absA = Math.abs(a);
  const { opts, ans } = generateNumOptions(absA);
  return Q(`|${a}| = ？`, opts, ans, 1, `绝对值表示数轴上点到原点的距离，|${a}| = ${absA}`, '有理数基础');
}

function qIntegral(): Question {
  const a1 = rand(1, 8), a2 = rand(1, 8);
  const sum = a1 + a2;
  const { opts, ans } = generateNumOptions(sum);
  return Q(`${a1}x + ${a2}x = ？`, opts.map(o => o + 'x'), ans, 1, `同类项合并：系数相加 ${a1} + ${a2} = ${sum}，字母不变`, '整式加减');
}

function qLinear(): Question {
  const x = rand(1, 10);
  const a = rand(2, 5);
  const b = rand(1, 10);
  const c = a * x + b;
  const { opts, ans } = generateNumOptions(x);
  return Q(`${a}x + ${b} = ${c}，x = ？`, opts, ans, 1, `移项：${a}x = ${c} − ${b} = ${c - b}，x = ${c - b} ÷ ${a} = ${x}`, '一元一次方程');
}

function qInequal(): Question {
  const x = rand(2, 8);
  const a = rand(2, 5);
  const b = rand(1, 10);
  const c = a * x + b;
  return Q(`解不等式 ${a}x + ${b} < ${c}，解集是？`, [`x < ${x}`, `x > ${x}`, `x ≤ ${x}`, `x ≥ ${x}`], 0, 1, `移项：${a}x < ${c - b}，x < ${x}`, '一元一次不等式');
}

function qSystem(): Question {
  const x = rand(1, 6);
  const y = rand(1, 6);
  const c1 = 2 * x + 3 * y;
  const c2 = 3 * x - 2 * y;
  return Q(`方程组 2x + 3y = ${c1} 与 3x − 2y = ${c2} 的解是？`, [`x=${x}, y=${y}`, `x=${y}, y=${x}`, `x=${x + 1}, y=${y}`, `x=${x}, y=${y + 1}`], 0, 1, `加减消元：×2 + ×3 消 y，得 x = ${x}，代入得 y = ${y}`, '二元一次方程组');
}

function qSegAngle(): Question {
  const a = rand(2, 10) * 2;
  const mid = a / 2;
  const { opts, ans } = generateNumOptions(mid);
  return Q(`线段 AB = ${a}cm，M 是 AB 中点，AM = ？`, opts, ans, 1, `中点分线段为两等份，AM = AB ÷ 2 = ${a} ÷ 2 = ${mid}cm`, '线段与角');
}

function qTriangle(): Question {
  const a = rand(40, 80);
  const b = rand(40, 80);
  const c = 180 - a - b;
  const { opts, ans } = generateNumOptions(c);
  return Q(`三角形两个角分别为 ${a}° 和 ${b}°，第三个角是？`, opts, ans, 1, `三角形内角和 = 180°，第三角 = 180° − ${a}° − ${b}° = ${c}°`, '三角形性质');
}

function qCongruent(): Question {
  const methods = ['SAS', 'ASA', 'SSS', 'AAS'];
  const descs = [
    '已知两边及其夹角对应相等',
    '已知两角及其夹边对应相等',
    '已知三边对应相等',
    '已知两角及其中一角的对边对应相等'
  ];
  const idx = rand(0, 3);
  const { opts, ans } = generateOptions(methods[idx], [methods[(idx + 1) % 4], methods[(idx + 2) % 4], methods[(idx + 3) % 4]]);
  return Q(`${descs[idx]}，判定三角形全等的依据是？`, opts, ans, 1, `${descs[idx]} → ${methods[idx]} 全等判定`, '全等三角形判定');
}

function qSimilar(): Question {
  const ratio = rand(2, 5);
  const side1 = ratio * rand(2, 5);
  const side2 = rand(2, 5);
  const { opts, ans } = generateOptions(`${ratio}:1`, [`1:${ratio}`, `${ratio + 1}:1`, `${ratio}:${ratio + 1}`]);
  return Q(`两个相似三角形对应边分别为 ${side1}cm 和 ${side2}cm，相似比是？`, opts, ans, 1, `相似比 = ${side1} : ${side2} = ${ratio} : 1`, '相似三角形');
}

function qPyth(): Question {
  const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];
  const [a, b, c] = triples[rand(0, triples.length - 1)];
  const { opts, ans } = generateNumOptions(c);
  return Q(`直角三角形两直角边为 ${a} 和 ${b}，斜边为？`, opts, ans, 1, `由勾股定理：c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}，c = ${c}`, '勾股定理');
}

function qQuad(): Question {
  const props = ['对边平行且相等', '对角线相等', '对角线互相垂直', '对角线相等且垂直'];
  const names = ['平行四边形', '矩形', '菱形', '正方形'];
  const idx = rand(0, 3);
  const { opts, ans } = generateOptions(props[idx], [props[(idx + 1) % 4], props[(idx + 2) % 4], props[(idx + 3) % 4]]);
  return Q(`${names[idx]}的性质是？`, opts, ans, 1, `${names[idx]}的性质：${props[idx]}`, '四边形性质');
}

function qCircle(): Question {
  const central = rand(60, 120);
  const inscribed = central / 2;
  const { opts, ans } = generateNumOptions(inscribed);
  return Q(`圆心角为 ${central}°，同弧所对的圆周角是？`, opts, ans, 1, `圆周角 = 圆心角 ÷ 2 = ${central}° ÷ 2 = ${inscribed}°`, '圆的性质');
}

function qFunc1(): Question {
  const k = rand(1, 3);
  const b = rand(-5, 5);
  const x = rand(1, 5);
  const y = k * x + b;
  const { opts, ans } = generateNumOptions(y);
  return Q(`一次函数 y = ${k}x + ${b}，当 x = ${x} 时，y = ？`, opts, ans, 1, `y = ${k}×${x} + ${b} = ${y}`, '一次函数');
}

function qInverse(): Question {
  const k = rand(2, 12);
  const x = rand(1, 5);
  const y = k / x;
  const { opts, ans } = generateOptions(String(y), [String(k + x), String(k - x), String(x / k)]);
  return Q(`反比例函数 y = ${k}/x，当 x = ${x} 时，y = ？`, opts, ans, 1, `y = ${k} ÷ ${x} = ${y}`, '反比例函数');
}

function qQuadfunc(): Question {
  const h = rand(-3, 3);
  const k = rand(-3, 3);
  const { opts, ans } = generateOptions(`(${h},${k})`, [`(${-h},${k})`, `(${h},${-k})`, `(${-h},${-k})`]);
  return Q(`二次函数 y = (x − ${h})² + ${k} 的顶点坐标是？`, opts, ans, 1, `顶点式为 y = a(x−h)² + k，顶点为 (${h},${k})`, '二次函数');
}

// ========== 高中（代表性子集） ==========

function qSet(): Question {
  const a = rand(1, 5);
  const b = rand(1, 5);
  return Q(`集合 A = {1,2,${a}}，B = {2,${a},${a + b}}，则 A ∩ B = ？`, [`{2,${a}}`, `{1,2,${a}}`, `{2}`, `{${a}}`], 0, 1, `交集取公共元素：A∩B = {2,${a}}`, '集合运算');
}

function qFuncConcept(): Question {
  const type = rand(0, 1);
  if (type === 0) {
    return Q(`下列是函数的是？`, [`y = x²`, `x² + y² = 1`, `y = ±x`, `|y| = x`], 0, 1, `函数要求每个 x 对应唯一 y，y=x² 满足`, '函数概念');
  }
  return Q(`函数 f(x) = 2x + 1，f(3) = ？`, ['7', '5', '6', '4'], 0, 1, `f(3) = 2×3 + 1 = 7`, '函数求值');
}

function qExpLog(): Question {
  const a = rand(2, 5);
  const n = rand(2, 4);
  const ans = Math.pow(a, n);
  const { opts, ans: ansIdx } = generateNumOptions(ans);
  return Q(`${a}^${n} = ？`, opts, ansIdx, 1, `${a}^${n} = ${ans}`, '指数运算');
}

function qTrig(): Question {
  const angles = [0, 30, 45, 60, 90];
  const idx = rand(0, 4);
  const deg = angles[idx];
  const rad = deg === 0 ? '0' : deg === 30 ? 'π/6' : deg === 45 ? 'π/4' : deg === 60 ? 'π/3' : 'π/2';
  const opts = ['0', '1/2', '√2/2', '√3/2', '1'];
  return Q(`sin(${rad}) = ？`, opts, idx, 1, `sin(${deg}°) = ${opts[idx]}`, '三角函数');
}

function qSequence(): Question {
  const a1 = rand(1, 5);
  const d = rand(1, 5);
  const n = rand(5, 10);
  const an = a1 + (n - 1) * d;
  const { opts, ans } = generateNumOptions(an);
  return Q(`等差数列首项 ${a1}，公差 ${d}，第 ${n} 项是？`, opts, ans, 1, `aₙ = a₁ + (n-1)d = ${a1} + ${n - 1}×${d} = ${an}`, '等差数列');
}

function qVector(): Question {
  const a = rand(1, 5);
  const b = rand(1, 5);
  const c = rand(1, 5);
  const d = rand(1, 5);
  const x = a + c;
  const y = b + d;
  const { opts, ans } = generateOptions(`(${x},${y})`, [`(${a - c},${b - d})`, `(${x + 1},${y})`, `(${x},${y + 1})`]);
  return Q(`向量 (${a},${b}) + (${c},${d}) = ？`, opts, ans, 1, `向量相加：对应分量相加 (${a}+${c}, ${b}+${d}) = (${x},${y})`, '向量运算');
}

function qDeriv(): Question {
  const a = rand(2, 5);
  const n = rand(2, 4);
  const coef = a * n;
  const exp = n - 1;
  return Q(`函数 f(x) = ${a}x^${n}，f'(x) = ？`, [`${coef}x^${exp}`, `${a}x^${exp}`, `${coef}x^${n}`, `${n}x^${exp}`], 0, 1, `幂函数求导：f'(x) = ${a}×${n}x^${n - 1} = ${coef}x^${exp}`, '导数');
}

export const GENERATORS: Record<string, () => Question> = {
  // 小学
  count: qCount,
  addsub: qAddSub,
  multi: qMulti,
  divide: qDivide,
  fourops: qFourops,
  plant: qPlant,
  sumdiff: qSumdiff,
  average: qAverage,
  fraction: qFraction,
  // 初中
  rational: qRational,
  integral: qIntegral,
  linear1: qLinear,
  inequal: qInequal,
  system: qSystem,
  segangle: qSegAngle,
  triangle: qTriangle,
  congruent: qCongruent,
  similar: qSimilar,
  pyth: qPyth,
  quad: qQuad,
  circ: qCircle,
  func1: qFunc1,
  inverse: qInverse,
  quadfunc: qQuadfunc,
  // 高中（代表性）
  set: qSet,
  func: qFuncConcept,
  explog: qExpLog,
  trig: qTrig,
  sequence: qSequence,
  vector: qVector,
  deriv: qDeriv,
};
