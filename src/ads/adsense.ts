/** AdSense integration plumbing: load the script once, push each ad unit once. */

const SCRIPT_ID = 'adsbygoogle-js';
const AD_SCRIPT_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

type AdWindow = Window & { adsbygoogle?: unknown[] };

/** URL of the AdSense loader script for a publisher id. */
export function adScriptUrl(clientId: string): string {
  return `${AD_SCRIPT_SRC}?client=${encodeURIComponent(clientId)}`;
}

/** Load the AdSense loader script once per document, on demand (content pages only). */
export function ensureAdSenseScript(clientId: string): void {
  if (typeof document === 'undefined' || !clientId) return;
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = adScriptUrl(clientId);
  document.head.appendChild(script);
}

/** Ask AdSense to fill a unit. Idempotent per element — safe under StrictMode re-mounts. */
export function pushAd(ins: HTMLElement): void {
  if (typeof window === 'undefined') return;
  if (ins.dataset.adsbygoogleInjected === 'true') return;
  ins.dataset.adsbygoogleInjected = 'true';
  const adWindow = window as AdWindow;
  (adWindow.adsbygoogle = adWindow.adsbygoogle || []).push({});
}
