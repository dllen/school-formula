/**
 * 常用物理常数。neutral 层只保留国际通用符号与数值、单位——数量名
 * （"Gravitational acceleration"）与连接词 "or" 是文案，属于语言文件。
 * `alternate` 用于同一个常数的第二常用取值（例如 g 的 9.8 与 10）。
 */
export interface PhysicalConstant {
  /** 国际通用符号，语言中立。 */
  symbol: string;
  /** 数值与国际单位符号，例如 `9.8 m/s²`。 */
  value: string;
  /** 第二常用取值，语言无关。 */
  alternate?: string;
}

export function physicalConstants(): PhysicalConstant[] {
  return [
    { symbol: 'g', value: '9.8 m/s²', alternate: '10 m/s²' },
    { symbol: 'c', value: '3.00 × 10⁸ m/s' },
    { symbol: 'h', value: '6.63 × 10⁻³⁴ J·s' },
    { symbol: 'e', value: '1.60 × 10⁻¹⁹ C' },
    { symbol: 'mₑ', value: '9.11 × 10⁻³¹ kg' },
    { symbol: 'mₚ', value: '1.67 × 10⁻²⁷ kg' },
    { symbol: 'Nₐ', value: '6.02 × 10²³ mol⁻¹' },
    { symbol: 'k', value: '9.0 × 10⁹ N·m²/C²' },
  ];
}
