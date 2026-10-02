import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES } from '../../src/data/reference';
import { hostRedirect, isRedirectableMethod, legacyReferenceRedirect, legacyViewRedirect } from './redirect';

describe('hostRedirect', () => {
  it('redirects mobi/one apex and www to syy.global preserving path and query', () => {
    expect(hostRedirect(new URL('https://syy.mobi/tutorial?kp=1'))).toBe('https://syy.global/tutorial?kp=1');
    expect(hostRedirect(new URL('https://www.syy.one/'))).toBe('https://syy.global/');
  });

  it('leaves canonical and api hosts alone', () => {
    expect(hostRedirect(new URL('https://syy.global/'))).toBeNull();
    expect(hostRedirect(new URL('https://api.syy.mobi/api/health'))).toBeNull();
  });
});

describe('legacyViewRedirect', () => {
  it('rewrites /?view=practice&kp=p1 to /practice?kp=p1', () => {
    expect(legacyViewRedirect(new URL('https://syy.global/?view=practice&kp=p1'))).toBe('https://syy.global/practice?kp=p1');
  });

  it('rewrites knowledge view to root', () => {
    expect(legacyViewRedirect(new URL('https://syy.global/?view=knowledge'))).toBeNull();
  });

  it('ignores non-root paths and unknown views', () => {
    expect(legacyViewRedirect(new URL('https://syy.global/tutorial?view=practice'))).toBeNull();
    expect(legacyViewRedirect(new URL('https://syy.global/?view=bogus'))).toBeNull();
    expect(legacyViewRedirect(new URL('https://syy.global/'))).toBeNull();
  });
});

describe('legacyReferenceRedirect', () => {
  it('moves a flat chart URL under its category', () => {
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/reference/multiplication-chart/')),
    ).toBe('https://syy.global/en/math/multiplication-chart/');
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/reference/physics-constants')),
    ).toBe('https://syy.global/en/science/physics-constants/');
  });

  it('maps every legacy slug to its exact category', () => {
    const expected: Record<string, string> = {
      'multiplication-chart': 'math',
      'squares-cubes-roots': 'math',
      'trigonometric-identities': 'math',
      'metric-conversions': 'math',
      'physics-constants': 'science',
      'irregular-verbs': 'english',
    };
    for (const [slug, category] of Object.entries(expected)) {
      expect(legacyReferenceRedirect(new URL(`https://syy.global/en/reference/${slug}/`))).toBe(
        `https://syy.global/en/${category}/${slug}/`,
      );
    }
  });

  it('ignores paths outside the legacy prefix', () => {
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/math/multiplication-chart/')),
    ).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/en/reference/'))).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/en/reference/nope/'))).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/tutorial'))).toBeNull();
  });

  // 这些 slug 只是 Object.prototype 的继承属性，从不是真实图表。
  // 普通对象查找会把它们当成命中，发出指向垃圾目标的 301——应当是 404。
  it('does not treat inherited object members as legacy slugs', () => {
    for (const slug of ['toString', 'constructor', '__proto__']) {
      expect(legacyReferenceRedirect(new URL(`https://syy.global/en/reference/${slug}/`))).toBeNull();
    }
  });
});

// LEGACY_REFERENCE_CATEGORY 是数据集里 slug→学科事实的第二份副本，没有编译期连线。
// 数据集里改名某个 slug，legacy 301 会静默退化成 301→404 链，而 worker 自己的测试
// 仍会绿——所以这里真的把数据集导进来对账。
describe('legacy slug map stays in sync with the dataset', () => {
  const LEGACY_SLUGS = [
    'multiplication-chart',
    'squares-cubes-roots',
    'trigonometric-identities',
    'metric-conversions',
    'physics-constants',
    'irregular-verbs',
  ];

  it('resolves every legacy slug to a shipped page carrying the claimed category', () => {
    for (const slug of LEGACY_SLUGS) {
      const target = legacyReferenceRedirect(new URL(`https://syy.global/en/reference/${slug}/`));
      expect(target, `${slug} dropped out of the legacy map`).not.toBeNull();
      if (!target) continue;
      // /en/<category>/<slug>/ → ['', 'en', category, slug, '']
      const [, , category, redirectedSlug] = new URL(target).pathname.split('/');
      expect(redirectedSlug).toBe(slug);
      const page = REFERENCE_PAGES.find((candidate) => candidate.slug === redirectedSlug);
      expect(page, `${slug} exists in the legacy map but not in the dataset`).toBeDefined();
      expect(page?.category).toBe(category);
    }
  });
});

describe('isRedirectableMethod', () => {
  it('redirects both GET and HEAD so HEAD matches GET (RFC 9110 §9.3.2)', () => {
    expect(isRedirectableMethod('GET')).toBe(true);
    expect(isRedirectableMethod('HEAD')).toBe(true);
  });

  it('leaves other methods alone', () => {
    expect(isRedirectableMethod('OPTIONS')).toBe(false);
    expect(isRedirectableMethod('POST')).toBe(false);
    expect(isRedirectableMethod('')).toBe(false);
  });
});
