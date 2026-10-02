import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ensureAdSenseScript, pushAd } from './adsense';
import { AD_SLOTS, ADSENSE_CLIENT_ID, isAdConfigured, type AdPlacement } from './config';

const RESERVED_MIN_HEIGHT = 90;

/**
 * A single AdSense display unit. Renders nothing unless the publisher and unit ids are
 * configured, reserves space so ad load does not shift layout, and never serves to
 * plus/pro members. Placement is driven entirely by `AD_SLOTS` in `./config`.
 */
export function AdUnit({ placement }: { placement: AdPlacement }) {
  const insRef = useRef<HTMLModElement>(null);
  const { user } = useAuth();
  const slot = AD_SLOTS[placement];
  const configured = isAdConfigured(ADSENSE_CLIENT_ID, slot);
  const adFree = user?.tier === 'plus' || user?.tier === 'pro';

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) return;
    if (adFree) {
      // Paying members keep the reserved space collapsed rather than seeing an ad.
      ins.style.display = 'none';
      return;
    }
    if (!configured) return;
    ensureAdSenseScript(ADSENSE_CLIENT_ID);
    pushAd(ins);
  }, [adFree, configured]);

  if (!configured) return null;

  return (
    <div className="my-6" data-ad-placement={placement}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: RESERVED_MIN_HEIGHT }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
