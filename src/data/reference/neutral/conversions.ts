/**
 * 公制换算表的数据行。分组标签（Length / Mass / Time）是英文，会随语言文件走——
 * `es/` 落地时把这份行数据包进自己的分组标签即可。
 */
export function metricConversionRows(): string[][] {
  return [
    ['Length', '1 km = 1000 m'],
    ['', '1 m = 100 cm = 1000 mm'],
    ['', '1 cm = 10 mm'],
    ['Mass', '1 t = 1000 kg'],
    ['', '1 kg = 1000 g'],
    ['', '1 g = 1000 mg'],
    ['Time', '1 h = 60 min = 3600 s'],
    ['', '1 min = 60 s'],
    ['', '1 day = 24 h'],
  ];
}
