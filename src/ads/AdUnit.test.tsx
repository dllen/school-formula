import { render } from '@testing-library/react';
import { type ContextType } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, type User } from '../context/auth-context';
import { ensureAdSenseScript, pushAd } from './adsense';
import { AdUnit } from './AdUnit';
import { AD_SLOTS, ADSENSE_CLIENT_ID } from './config';

// happy-dom refuses to load the external AdSense script, so stub the loader here.
vi.mock('./adsense', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./adsense')>();
  return { ...actual, ensureAdSenseScript: vi.fn() };
});

type AuthValue = NonNullable<ContextType<typeof AuthContext>>;

function makeAuth(user: User | null): AuthValue {
  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
    login: async () => {},
    register: async () => {},
    forgotPassword: async () => {},
    resetPassword: async () => {},
    logout: () => {},
    refreshUser: async () => {},
  };
}

function renderUnit(user: User | null) {
  return render(
    <AuthContext.Provider value={makeAuth(user)}>
      <AdUnit placement="knowledgeMid" />
    </AuthContext.Provider>,
  );
}

const member = (tier: User['tier']): User => ({
  id: 'u1',
  email: 'member@example.com',
  nickname: null,
  avatar_url: null,
  tier,
  email_verified: true,
});

const adWindow = () => window as Window & { adsbygoogle?: unknown[] };

beforeEach(() => {
  vi.mocked(ensureAdSenseScript).mockClear();
  adWindow().adsbygoogle = undefined;
});

describe('AdUnit', () => {
  it('renders a unit carrying the real publisher id and the placement slot', () => {
    const { container } = renderUnit(null);
    const ins = container.querySelector('ins.adsbygoogle');
    expect(ins?.getAttribute('data-ad-client')).toBe(ADSENSE_CLIENT_ID);
    expect(ins?.getAttribute('data-ad-slot')).toBe(AD_SLOTS.knowledgeMid);
  });

  it('loads the script once with the publisher id and pushes the unit once', () => {
    const { container } = renderUnit(null);
    expect(vi.mocked(ensureAdSenseScript)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(ensureAdSenseScript)).toHaveBeenCalledWith(ADSENSE_CLIENT_ID);
    expect(adWindow().adsbygoogle).toHaveLength(1);

    // Re-pushing the same element (e.g. a StrictMode re-mount) must not double-inject.
    pushAd(container.querySelector('ins.adsbygoogle') as HTMLElement);
    expect(adWindow().adsbygoogle).toHaveLength(1);
  });

  it('never serves ads to plus or pro members', () => {
    const { container } = renderUnit(member('plus'));
    expect(adWindow().adsbygoogle ?? []).toHaveLength(0);
    expect(vi.mocked(ensureAdSenseScript)).not.toHaveBeenCalled();
    const ins = container.querySelector('ins.adsbygoogle') as HTMLElement;
    expect(ins.style.display).toBe('none');
  });

  it('serves ads to free and anonymous visitors', () => {
    renderUnit(member('free'));
    expect(adWindow().adsbygoogle).toHaveLength(1);
  });
});
