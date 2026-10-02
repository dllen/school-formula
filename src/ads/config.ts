const env = import.meta.env as Record<string, string | undefined>;

/** Real AdSense publisher id. Override with `VITE_ADSENSE_CLIENT_ID` at build time. */
export const ADSENSE_CLIENT_ID = env.VITE_ADSENSE_CLIENT_ID ?? 'ca-pub-3563451416072185';

/**
 * Ad unit ids come from the AdSense dashboard. Set them via `VITE_ADSENSE_SLOT_*` at build
 * time; this placeholder keeps the surface wired up until real unit ids are provided.
 */
const PLACEHOLDER_SLOT = '0000000000';

export const AD_SLOTS = {
  /** Knowledge detail page, mid-content. */
  knowledgeMid: env.VITE_ADSENSE_SLOT_KNOWLEDGE_MID ?? PLACEHOLDER_SLOT,
  /** Knowledge detail page, after the content. */
  knowledgeBottom: env.VITE_ADSENSE_SLOT_KNOWLEDGE_BOTTOM ?? PLACEHOLDER_SLOT,
  /** English reference chart page, after the table. */
  referenceBottom: env.VITE_ADSENSE_SLOT_REFERENCE_BOTTOM ?? PLACEHOLDER_SLOT,
} as const;

export type AdPlacement = keyof typeof AD_SLOTS;

/** An ad renders only when both the publisher id and a unit id are present. */
export function isAdConfigured(clientId: string, slot: string): boolean {
  return Boolean(clientId && slot);
}
