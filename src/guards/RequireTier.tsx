import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginModal } from '../components/auth/LoginModal';
import { PaywallModal } from '../components/auth/PaywallModal';

const TIER_ORDER: Record<string, number> = { free: 0, plus: 1, pro: 2 };

interface Props {
  tier: 'free' | 'plus' | 'pro';
  children: React.ReactNode;
}

export function RequireTier({ tier, children }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  if (tier === 'free') return <>{children}</>;

  if (!isAuthenticated || !user) {
    return (
      <>
        <div className="cursor-pointer opacity-75 hover:opacity-100 transition" onClick={() => setShowLogin(true)}>
          {children}
        </div>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  if (TIER_ORDER[user.tier] < TIER_ORDER[tier]) {
    return (
      <>
        <div className="cursor-pointer opacity-75 hover:opacity-100 transition" onClick={() => setShowPaywall(true)}>
          {children}
        </div>
        {showPaywall && <PaywallModal requiredTier={tier} onClose={() => setShowPaywall(false)} />}
      </>
    );
  }

  return <>{children}</>;
}
