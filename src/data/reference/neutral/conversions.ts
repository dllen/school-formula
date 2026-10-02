/**
 * 公制换算的数据。分组只带一个稳定的键，显示名（Length / Mass / Time）由语言文件提供——
 * neutral 层不含任何文案。等式本身只由数字与国际单位符号组成，语言无关。
 */
export type ConversionGroupKey = 'length' | 'mass' | 'time';

export interface ConversionGroup {
  key: ConversionGroupKey;
  /** 每条是一个换算等式，例如 `1 km = 1000 m`。 */
  entries: string[];
}

export function metricConversionGroups(): ConversionGroup[] {
  return [
    { key: 'length', entries: ['1 km = 1000 m', '1 m = 100 cm = 1000 mm', '1 cm = 10 mm'] },
    { key: 'mass', entries: ['1 t = 1000 kg', '1 kg = 1000 g', '1 g = 1000 mg'] },
    { key: 'time', entries: ['1 h = 60 min = 3600 s', '1 min = 60 s', '1 d = 24 h'] },
  ];
}
