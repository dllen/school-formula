import { describe, expect, it } from 'vitest';
import { injectPage, outputFileFor } from './inject';

const TEMPLATE =
  '<html lang="zh-CN"><head><title>default</title><script type="module" src="/app.js"></script></head><body><div id="root"></div></body></html>';

describe('injectPage', () => {
  it('sets the html lang, head tags and app html', () => {
    const result = injectPage(TEMPLATE, {
      appHtml: '<h1>Hello</h1>',
      headHtml: '<title>Page</title>\n    <meta name="description" content="Desc" />',
      htmlLang: 'en',
    });
    expect(result).toContain('<html lang="en">');
    expect(result).toContain('<title>Page</title>');
    expect(result).toContain('<meta name="description" content="Desc" />');
    expect(result).not.toContain('<title>default</title>');
    expect(result).toContain('<div id="root"><h1>Hello</h1></div>');
    // untouched template chrome survives
    expect(result).toContain('<script type="module" src="/app.js"></script>');
  });

  it('keeps the default language unchanged', () => {
    const result = injectPage(TEMPLATE, { appHtml: '', headHtml: '<title>x</title>', htmlLang: 'zh-CN' });
    expect(result).toContain('<html lang="zh-CN">');
  });

  it('does not interpret `$` sequences in the injected fragments', () => {
    const result = injectPage(TEMPLATE, { appHtml: 'price $& $1', headHtml: '<title>$& title</title>', htmlLang: 'en' });
    expect(result).toContain('<div id="root">price $& $1</div>');
    expect(result).toContain('<title>$& title</title>');
  });

  it('throws when the root placeholder is missing', () => {
    expect(() =>
      injectPage('<html><head><title>x</title></head></html>', { appHtml: 'x', headHtml: '<title>y</title>', htmlLang: 'en' }),
    ).toThrow('root placeholder');
  });

  it('throws when the title element is missing', () => {
    expect(() =>
      injectPage('<html><body><div id="root"></div></body></html>', { appHtml: 'x', headHtml: '<title>y</title>', htmlLang: 'en' }),
    ).toThrow('title element');
  });
});

describe('outputFileFor', () => {
  it('maps routes to directory index files', () => {
    expect(outputFileFor('/')).toBe('index.html');
    expect(outputFileFor('/tutorial')).toBe('tutorial/index.html');
    expect(outputFileFor('/knowledge/p-math-1')).toBe('knowledge/p-math-1/index.html');
    expect(outputFileFor('/en')).toBe('en/index.html');
    expect(outputFileFor('/en/reference/multiplication-chart')).toBe('en/reference/multiplication-chart/index.html');
  });
});
