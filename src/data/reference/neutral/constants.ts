/**
 * 常用物理常数的数值行。这里的标签（Gravitational acceleration 等）是英文，
 * 属于语言文件的责任；生成器一侧保持稳定，只保证数值与单位写法一致。
 */
export function physicsConstantRows(): string[][] {
  return [
    ['Gravitational acceleration', 'g', '9.8 m/s² (or 10 m/s²)'],
    ['Speed of light in vacuum', 'c', '3.00 × 10⁸ m/s'],
    ['Planck constant', 'h', '6.63 × 10⁻³⁴ J·s'],
    ['Elementary charge', 'e', '1.60 × 10⁻¹⁹ C'],
    ['Electron mass', 'mₑ', '9.11 × 10⁻³¹ kg'],
    ['Proton mass', 'mₚ', '1.67 × 10⁻²⁷ kg'],
    ['Avogadro constant', 'Nₐ', '6.02 × 10²³ mol⁻¹'],
    ['Coulomb constant', 'k', '9.0 × 10⁹ N·m²/C²'],
  ];
}
