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

// 本文件测的是「广告位已配置」的渲染路径，而 AD_SLOTS 在未配置时的真实默认是 null。
// 所以注入一组可变的 slot id；「未配置则什么都不渲染」由本文件最后一条用例覆盖。
const { slots } = vi.hoisted(() => ({
  slots: {
    knowledgeMid: '1234567890',
    knowledgeBottom: '2345678901',
    referenceBottom: '3456789012',
  } as Record<string, string | null>,
}));

vi.mock('./config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./config')>();
  return { ...actual, AD_SLOTS: slots };
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
  // 有一条用例会把 slot 置空，这里恢复回去，免得污染后面的用例。
  slots.knowledgeMid = '1234567890';
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

  // 这条守的是「拿不到真实 slot id 时不要留一块空白」。slot 的默认值曾经是占位串
  // '0000000000'，它是真值，于是每一页都渲染出一个 slot 非法的 <ins>，占着 90px
  // 且永远不会被填充。
  it('renders nothing at all when the placement has no slot id', () => {
    slots.knowledgeMid = null;
    const { container } = renderUnit(null);

    expect(container.querySelector('ins.adsbygoogle')).toBeNull();
    expect(container.textContent).toBe('');
    expect(vi.mocked(ensureAdSenseScript)).not.toHaveBeenCalled();
  });
});
