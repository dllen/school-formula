/** 生成 [min, max] 范围内的随机整数 */
export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 打乱数组（Fisher-Yates） */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 生成选项：正确答案 + 干扰项，返回打乱后的选项和正确答案索引 */
export function generateOptions(
  correct: string,
  distractors: string[]
): { opts: string[]; ans: number } {
  const all = [correct, ...distractors];
  const shuffled = shuffle(all);
  const ans = shuffled.indexOf(correct);
  return { opts: shuffled, ans };
}

/** 生成数值型选项 */
export function generateNumOptions(
  answer: number,
  count: number = 4
): { opts: string[]; ans: number } {
  const distractors = new Set<string>();
  let attempts = 0;
  while (distractors.size < count - 1 && attempts < 100) {
    attempts++;
    const offset = rand(1, Math.max(3, Math.floor(Math.abs(answer) * 0.3) + 1));
    const sign = Math.random() > 0.5 ? 1 : -1;
    const d = answer + sign * offset;
    if (d !== answer && d >= 0) {
      distractors.add(String(d));
    }
  }
  return generateOptions(String(answer), [...distractors]);
}
