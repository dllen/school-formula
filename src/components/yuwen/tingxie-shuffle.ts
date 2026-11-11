// src/components/yuwen/tingxie-shuffle.ts

/** 固定种子的洗牌：预渲染与客户端必须得到同一顺序，不能用 Math.random。 */
export function deterministicShuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = (i * 7 + 3) % (i + 1);
    const tmp = out[i] as T;
    out[i] = out[j] as T;
    out[j] = tmp;
  }
  return out;
}
