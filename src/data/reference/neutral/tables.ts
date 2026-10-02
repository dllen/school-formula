import { range, squareRoot } from './numeric';

/**
 * 乘法表数据行：每行是 `[行号, ...1..max 的乘积]`，即 `1 + max` 宽。
 * 行号是数字本身，语言中立，所以放在生成器里；表头行仍由语言文件拼。
 */
export function multiplicationRows(max = 12): string[][] {
  const numbers = range(1, max);
  return numbers.map((row) => [String(row), ...numbers.map((col) => String(row * col))]);
}

/** n / n² / n³ / √n 四列，n 从 1 到 max。 */
export function squaresCubesRootsRows(max = 20): string[][] {
  return range(1, max).map((n) => [String(n), String(n * n), String(n ** 3), squareRoot(n)]);
}
