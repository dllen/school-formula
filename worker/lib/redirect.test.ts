import { describe, expect, it } from 'vitest';
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
