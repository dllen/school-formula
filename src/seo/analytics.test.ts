import { describe, expect, it } from 'vitest';
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
