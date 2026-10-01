import { describe, expect, it } from 'vitest';
import { appPathFor, DEFAULT_LANGUAGE, languageForPath } from './languages';

describe('languageForPath', () => {
  it('detects the prefix language', () => {
    expect(languageForPath('/en').code).toBe('en');
    expect(languageForPath('/en/').code).toBe('en');
    expect(languageForPath('/en/reference/multiplication-chart').code).toBe('en');
  });

  it('defaults to Chinese for unprefixed paths', () => {
    expect(languageForPath('/')).toBe(DEFAULT_LANGUAGE);
    expect(languageForPath('/knowledge/p-math-1').code).toBe('zh-CN');
  });

  it('does not treat lookalike paths as English', () => {
    expect(languageForPath('/entertainment').code).toBe('zh-CN');
    expect(languageForPath('/energize').code).toBe('zh-CN');
  });
});

describe('appPathFor', () => {
  it('strips the language prefix', () => {
    expect(appPathFor('/en')).toBe('/');
    expect(appPathFor('/en/')).toBe('/');
    expect(appPathFor('/en/reference/multiplication-chart')).toBe('/reference/multiplication-chart');
  });

  it('leaves unprefixed paths alone', () => {
    expect(appPathFor('/')).toBe('/');
    expect(appPathFor('/tutorial')).toBe('/tutorial');
  });
});
