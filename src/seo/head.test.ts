import { describe, expect, it } from 'vitest';
import { renderHead } from './head';
import { buildSeoMeta } from './meta';

describe('renderHead', () => {
  it('renders title, description, canonical, Open Graph and Twitter tags', () => {
    const html = renderHead(buildSeoMeta('/practice'));
    expect(html).toContain('<title>');
    expect(html).toContain('name="description"');
    expect(html).toContain('rel="canonical" href="https://syy.global/practice/"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:url" content="https://syy.global/practice/"');
    expect(html).toContain('name="twitter:card"');
    expect(html).toContain('rel="alternate" hreflang="x-default"');
  });

  it('emits parseable JSON-LD that cannot break out of the script tag', () => {
    const html = renderHead(buildSeoMeta('/knowledge/p-eng-001'));
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
    const html = renderHead({
      ...buildSeoMeta('/'),
      title: 'A <b> & "quote"',
      description: 'x < y',
    });
    expect(html).toContain('<title>A &lt;b&gt; &amp; &quot;quote&quot;</title>');
    expect(html).toContain('content="x &lt; y"');
  });
});
