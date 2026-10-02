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
  const wanted = count - 1;

  // 两轮：先只收非负干扰项（低龄题目里负选项不合适），凑不齐再放开符号限制。
  //
  // 单靠第一轮不够，而且失败得很隐蔽：接受条件里有 `d >= 0`，offset 又只到 3，
  // 于是答案 <= -4 时一个干扰项也凑不出来——这个函数会**静默**返回少于 count 个
  // 选项，而调用方和测试都当它一定给满 4 个。qFunc1 的 y = kx + b（b 可取负）
  // 是唯一能产出负答案的生成器，症状是 generators.test.ts 约 1/30 轮偶发失败。
  for (const nonNegativeOnly of [true, false]) {
    let attempts = 0;
    while (distractors.size < wanted && attempts < 100) {
      attempts++;
      const offset = rand(1, Math.max(3, Math.floor(Math.abs(answer) * 0.3) + 1));
      const sign = Math.random() > 0.5 ? 1 : -1;
      const d = answer + sign * offset;
      if (d !== answer && (!nonNegativeOnly || d >= 0)) {
        distractors.add(String(d));
      }
    }
    if (distractors.size >= wanted) break;
  }

  return generateOptions(String(answer), [...distractors]);
}
