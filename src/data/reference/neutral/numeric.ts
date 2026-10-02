/** 闭区间整数列表。供生成器与语言文件拼表头共用。 */
export function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

/** 平方根，保留三位小数并去掉尾随零（`√2` → `'1.414'`，`√4` → `'2'`）。 */
export function squareRoot(n: number): string {
  return String(Number(Math.sqrt(n).toFixed(3)));
}
