import { range, squareRoot } from './numeric';

/** 乘法表数据行（1..max × 1..max 的乘积），不含表头行。表头由语言文件拼。 */
export function multiplicationRows(max = 12): string[][] {
  const numbers = range(1, max);
  return numbers.map((row) => numbers.map((col) => String(row * col)));
}

/** n / n² / n³ / √n 四列，n 从 1 到 max。 */
export function squaresCubesRootsRows(max = 20): string[][] {
  return range(1, max).map((n) => [String(n), String(n * n), String(n ** 3), squareRoot(n)]);
}
