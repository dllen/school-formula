import { describe, expect, it } from 'vitest';
import type { ReferencePage } from './types';
import { validateReferencePages } from './validate';

function page(overrides: Partial<ReferencePage> = {}): ReferencePage {
  return {
    slug: 'a-page',
    category: 'math',
    title: 'A Page',
    summary: 'A summary.',
    description: 'A description.',
    intro: 'An intro.',
    blocks: [{ kind: 'table', rows: [['1']] }],
    howToUse: ['Do this.', 'Then that.'],
    faq: [
      { q: 'Q1', a: 'A1' },
      { q: 'Q2', a: 'A2' },
      { q: 'Q3', a: 'A3' },
    ],
    related: [],
    ...overrides,
  };
}

describe('validateReferencePages', () => {
  it('accepts a well-formed page set', () => {
    expect(() => validateReferencePages([page()])).not.toThrow();
  });

  it('rejects duplicate slugs', () => {
    expect(() => validateReferencePages([page(), page()])).toThrow(/duplicate slug: a-page/);
  });

  it('rejects empty required copy', () => {
    expect(() => validateReferencePages([page({ intro: '   ' })])).toThrow(/empty intro/);
    expect(() => validateReferencePages([page({ title: '' })])).toThrow(/empty title/);
    expect(() => validateReferencePages([page({ summary: '' })])).toThrow(/empty summary/);
    expect(() => validateReferencePages([page({ description: ' ' })])).toThrow(/empty description/);
  });

  it('rejects a page with too few FAQ entries or how-to-use steps', () => {
    expect(() => validateReferencePages([page({ faq: [{ q: 'Q', a: 'A' }] })])).toThrow(
      /at least 3 FAQ/,
    );
    expect(() => validateReferencePages([page({ howToUse: ['one'] })])).toThrow(
      /at least 2 howToUse/,
    );
  });

  it('rejects a page with no blocks', () => {
    expect(() => validateReferencePages([page({ blocks: [] })])).toThrow(/at least one block/);
  });

  it('rejects an empty FAQ question or answer', () => {
    const faq = [
      { q: '', a: 'A' },
      { q: 'Q', a: 'A' },
      { q: 'Q', a: 'A' },
    ];
    expect(() => validateReferencePages([page({ faq })])).toThrow(/empty FAQ/);
  });

  it('rejects a related slug that no page declares', () => {
    expect(() => validateReferencePages([page({ related: ['ghost'] })])).toThrow(
      /related slug not found: ghost/,
    );
  });

  it('accepts a related slug that a sibling page declares', () => {
    const other = page({ slug: 'other-page' });
    expect(() => validateReferencePages([page({ related: ['other-page'] }), other])).not.toThrow();
  });

  it('allows an empty related list', () => {
    expect(() => validateReferencePages([page({ related: [] })])).not.toThrow();
  });

  it('reports every problem at once rather than the first', () => {
    const broken = page({ slug: 'broken', title: '', intro: '', blocks: [] });
    expect(() => validateReferencePages([broken])).toThrow(
      /empty title[\s\S]*empty intro[\s\S]*at least one block/,
    );
  });
});
