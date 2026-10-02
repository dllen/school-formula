const env = import.meta.env as Record<string, string | undefined>;

/** Real AdSense publisher id. Override with `VITE_ADSENSE_CLIENT_ID` at build time. */
export const ADSENSE_CLIENT_ID = env.VITE_ADSENSE_CLIENT_ID ?? 'ca-pub-3563451416072185';

/**
 * Ad unit ids come from the AdSense dashboard. Set them via `VITE_ADSENSE_SLOT_*` at build
 * time; before then a placement stays `null`.
 *
 * 这里刻意不用占位串。默认值曾经是 `'0000000000'`，它是个真值，于是
 * `isAdConfigured()` 返回 true，中英所有页面（包括预渲染出来的 HTML）都在渲染一个
 * slot 非法的 `<ins>`：页面上留一块 90px 的空白，而且永远不会被填充。
 * 拿不到真实 slot id 就让 AdUnit 真的返回 null——页面干净、也不会有 CLS。
 */
export const AD_SLOTS = {
  /** Knowledge detail page, mid-content. */
  knowledgeMid: env.VITE_ADSENSE_SLOT_KNOWLEDGE_MID ?? null,
  /** Knowledge detail page, after the content. */
  knowledgeBottom: env.VITE_ADSENSE_SLOT_KNOWLEDGE_BOTTOM ?? null,
  /** English reference chart page, after the table. */
  referenceBottom: env.VITE_ADSENSE_SLOT_REFERENCE_BOTTOM ?? null,
} as const;

export type AdPlacement = keyof typeof AD_SLOTS;

/**
 * 广告位是否已配置。返回类型收窄到 `string`，让调用方在判断之后能直接把 slot 当字符串用，
 * 不必再补一次空值断言。
 */
export function isAdConfigured(clientId: string, slot: string | null): slot is string {
  return Boolean(clientId) && Boolean(slot);
}
