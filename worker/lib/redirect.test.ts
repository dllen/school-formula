import { describe, expect, it } from 'vitest';
import { hostRedirect, legacyReferenceRedirect, legacyViewRedirect } from './redirect';

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

  it('covers every chart that existed before the move', () => {
    const slugs = [
      'multiplication-chart',
      'squares-cubes-roots',
      'trigonometric-identities',
      'metric-conversions',
      'physics-constants',
      'irregular-verbs',
    ];
    for (const slug of slugs) {
      const target = legacyReferenceRedirect(new URL(`https://syy.global/en/reference/${slug}/`));
      expect(target).toMatch(/^https:\/\/syy\.global\/en\/(math|science|english)\//);
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
