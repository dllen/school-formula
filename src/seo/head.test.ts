import { describe, expect, it } from 'vitest';
import { renderHead } from './head';
import { buildSeoMeta } from './meta';
import { writtenRouteSet } from './og';
import { OG_ROUTES } from './og-routes';

// 十张图都写成功——正常构建下 buildSeoMeta 收到的集合。
const ALL_WRITTEN = writtenRouteSet(OG_ROUTES);

// analyticsId 是受控入参：**每一条用例都显式传**，谁都不许隐式读跑测试的人家目录里
// 有没有 `.env`。以前那条「未设 id 时不注入」读的是 import.meta.env，于是它在没设
// 变量时恒真、在设了变量时必红——而「设上变量」正是启用 GA4 该做的事。
const NO_ID = undefined;
const TEST_ID = 'G-TEST123456';

describe('renderHead', () => {
  it('renders title, description, canonical, Open Graph and Twitter tags', () => {
    const html = renderHead(buildSeoMeta('/practice'), NO_ID);
    expect(html).toContain('<title>');
    expect(html).toContain('name="description"');
    expect(html).toContain('rel="canonical" href="https://syy.global/practice/"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:url" content="https://syy.global/practice/"');
    expect(html).toContain('name="twitter:card"');
    expect(html).toContain('rel="alternate" hreflang="x-default"');
  });

  it('emits parseable JSON-LD that cannot break out of the script tag', () => {
    const html = renderHead(buildSeoMeta('/knowledge/p-eng-001'), NO_ID);
    const scripts = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? [];
    expect(scripts.length).toBeGreaterThan(0);
    for (const script of scripts) {
      expect(script).not.toContain('</script></script>');
      const json = script.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
      expect(json).not.toContain('<');
      expect(() => JSON.parse(json)).not.toThrow();
    }
  });

  it('escapes HTML-special characters in text', () => {
    const html = renderHead(
      {
        ...buildSeoMeta('/'),
        title: 'A <b> & "quote"',
        description: 'x < y',
      },
      NO_ID,
    );
    expect(html).toContain('<title>A &lt;b&gt; &amp; &quot;quote&quot;</title>');
    expect(html).toContain('content="x &lt; y"');
  });
});

describe('renderHead analytics', () => {
  it('omits the analytics tags when the measurement id is unset', () => {
    const html = renderHead(buildSeoMeta('/en/math'), NO_ID);
    expect(html).not.toContain('googletagmanager');
    expect(html).not.toContain("gtag('consent'");
  });

  it('omits the analytics tags for an empty measurement id', () => {
    expect(renderHead(buildSeoMeta('/en/math'), '')).not.toContain('googletagmanager');
  });

  it('emits the consent default and the tag when a measurement id is set', () => {
    const html = renderHead(buildSeoMeta('/en/math'), TEST_ID);

    // 标签真的进了 head，且带的是传进来的那个 id。
    expect(html).toContain(`gtag('config','${TEST_ID}')`);
    expect(html).toContain(`<script async src="https://www.googletagmanager.com/gtag/js?id=${TEST_ID}"></script>`);
    expect(html).toContain("gtag('js',new Date())");
  });

  it('puts the regional consent default before the global one, with all 32 regions', () => {
    const html = renderHead(buildSeoMeta('/en/math'), TEST_ID);

    // 顺序是 Google 要求的：先按区域拒绝（EEA/UK/CH），再给其余区域授权。
    // 写反了就等于对所有人都先授权、再拒绝，等于没设。
    const regionAt = html.indexOf("gtag('consent','default',{region:[");
    const globalAt = html.indexOf("gtag('consent','default',{analytics_storage:'granted'");
    expect(regionAt).toBeGreaterThanOrEqual(0);
    expect(globalAt).toBeGreaterThan(regionAt);

    const regionSegment = html.slice(regionAt, globalAt);
    expect(regionSegment).toContain("analytics_storage:'denied'");
    expect(regionSegment.match(/'[A-Z]{2}'/g)).toHaveLength(32);
    for (const code of ['DE', 'FR', 'GB', 'CH', 'NO', 'IS', 'LI']) {
      expect(regionSegment).toContain(`'${code}'`);
    }
  });
});

describe('renderHead og:image', () => {
  it('emits the image and its dimensions when present', () => {
    const html = renderHead(buildSeoMeta('/en/math', ALL_WRITTEN), NO_ID);
    expect(html).toContain('<meta property="og:image" content="https://syy.global/og/math.png" />');
    expect(html).toContain('<meta property="og:image:width" content="1200" />');
    expect(html).toContain('<meta property="og:image:height" content="630" />');
  });

  it('emits nothing when the page has no image', () => {
    const html = renderHead(buildSeoMeta('/'), NO_ID);
    expect(html).not.toContain('og:image');
  });

  it('emits nothing when the card exists but its render failed', () => {
    // 这条是 Step 7b 那半边的守门人：标签的有无以「真的写出来了」为准。
    const partial = writtenRouteSet(OG_ROUTES.filter((entry) => entry.path !== 'og/math.png'));
    expect(renderHead(buildSeoMeta('/en/math', partial), NO_ID)).not.toContain('og:image');
  });
});
