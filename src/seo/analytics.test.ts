import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildAnalyticsTags, EEA_UK_CH_REGIONS } from './analytics';

describe('buildAnalyticsTags', () => {
  it('emits nothing at all when no measurement id is configured', () => {
    // 与 AD_SLOTS 改成 null 后的处理方式一致：宁可不注入，也不留一个空壳 script。
    expect(buildAnalyticsTags(undefined)).toEqual([]);
    expect(buildAnalyticsTags('')).toEqual([]);
  });

  it('denies analytics storage by default in EEA/UK/Switzerland and grants it elsewhere', () => {
    const [consent] = buildAnalyticsTags('G-TEST123');
    expect(consent).toContain("gtag('consent','default'");
    expect(consent).toContain("analytics_storage:'denied'");
    expect(consent).toContain('region:');
    for (const code of ['DE', 'FR', 'GB', 'CH', 'NO']) {
      expect(EEA_UK_CH_REGIONS).toContain(code);
    }
  });

  it('loads the tag with the configured id', () => {
    const tags = buildAnalyticsTags('G-TEST123');
    expect(tags.join('\n')).toContain('G-TEST123');
    expect(tags.join('\n')).toContain('googletagmanager.com/gtag/js');
  });
});

describe('EEA_UK_CH_REGIONS', () => {
  it('is exactly the EEA (EU-27 + Iceland, Liechtenstein, Norway) plus the UK and Switzerland', () => {
    expect([...EEA_UK_CH_REGIONS].sort()).toEqual(
      [
        'AT','BE','BG','CH','CY','CZ','DE','DK','EE','ES','FI','FR','GB','GR','HR','HU','IE','IS',
        'IT','LI','LT','LU','LV','MT','NL','NO','PL','PT','RO','SE','SI','SK',
      ].sort(),
    );
    expect(EEA_UK_CH_REGIONS).toHaveLength(32);
  });
});

describe('GA4_MEASUREMENT_ID', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  // head.ts 把 id 收成了受控入参，于是「环境变量到底有没有被读到」这件事不再有任何
  // 测试覆盖——补在这里，用 stubEnv + resetModules + 动态 import 真跑一次模块加载。
  // 少了它，`.env` 里写上 VITE_GA4_ID 而线上不出标签，没有任何测试会红。
  it('reads VITE_GA4_ID at module load', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_GA4_ID', 'G-ENVTEST123');
    const { GA4_MEASUREMENT_ID } = await import('./analytics');
    expect(GA4_MEASUREMENT_ID).toBe('G-ENVTEST123');
  });

  it('is empty when the build-time variable is not provided', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_GA4_ID', '');
    const { GA4_MEASUREMENT_ID } = await import('./analytics');
    // renderHead 那边按 falsy 判断，空串与 undefined 都不注入标签。
    expect(buildAnalyticsTags(GA4_MEASUREMENT_ID)).toEqual([]);
  });
});
