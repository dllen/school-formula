// src/seo/analytics.ts
const env = import.meta.env as Record<string, string | undefined>;

/** GA4 measurement id（`G-XXXXXXX`）。未设置时整个分析标签不注入。 */
export const GA4_MEASUREMENT_ID: string | undefined = env.VITE_GA4_ID;

/**
 * 同意模式默认值要拒绝的区域：EEA（EU-27 + 冰岛、列支敦士登、挪威）+ 英国 + 瑞士。
 *
 * 名单按定义写死为可核对的常量，而不是抄一份会过期的国家列表：EU-27 加上
 * IS/LI/NO 是 EEA 的定义，GB/CH 按 spec 的要求一并纳入。
 *
 * 这些区域默认 `analytics_storage: 'denied'`，其余区域 granted——所以 GA4
 * 现在就能合规上线，不必等 CMP；CMP 获批后接管 ads 同意，analytics 这部分
 * 已经是对的。
 */
export const EEA_UK_CH_REGIONS: readonly string[] = [
  // EU-27
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU',
  'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
  // EEA 非欧盟
  'IS', 'LI', 'NO',
  // 按 spec 一并纳入
  'GB', 'CH',
];

/** GA4 的 head 片段。未配置 id 时返回空数组。 */
export function buildAnalyticsTags(measurementId: string | undefined): string[] {
  if (!measurementId) return [];

  const regions = EEA_UK_CH_REGIONS.map((code) => `'${code}'`).join(',');

  return [
    '<script>window.dataLayer=window.dataLayer||[];' +
      "function gtag(){dataLayer.push(arguments);}" +
      "gtag('consent','default',{region:[" + regions + "]," +
      "analytics_storage:'denied',ad_storage:'denied'});" +
      "gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied'});" +
      "gtag('js',new Date());" +
      `gtag('config','${measurementId}');</script>`,
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>`,
  ];
}
