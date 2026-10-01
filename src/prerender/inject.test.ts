import { describe, expect, it } from 'vitest';
import { injectAppHtml, outputFileFor } from './inject';

describe('injectAppHtml', () => {
  it('replaces the root div with rendered app html', () => {
    const template = '<html><body><div id="root"></div><script src="/src/main.tsx"></script></body></html>';
    const result = injectAppHtml(template, '<h1>你好</h1>');
    expect(result).toBe('<html><body><div id="root"><h1>你好</h1></div><script src="/src/main.tsx"></script></body></html>');
  });

  it('throws when the root placeholder is missing', () => {
    expect(() => injectAppHtml('<html></html>', '<h1>x</h1>')).toThrow('root placeholder');
  });
});

describe('outputFileFor', () => {
  it('maps routes to directory index files', () => {
    expect(outputFileFor('/')).toBe('index.html');
    expect(outputFileFor('/tutorial')).toBe('tutorial/index.html');
    expect(outputFileFor('/knowledge/p-math-1')).toBe('knowledge/p-math-1/index.html');
  });
});
