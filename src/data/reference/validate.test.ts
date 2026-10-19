import { describe, expect, it } from 'vitest';
import type { ReferencePage } from './types';
import { validateReferencePages } from './validate';

/**
 * 默认 fixture 把 prose 撑到 ≥ 400 词、related 指向一个已知兄弟；
 * 想要拉成「半成品」就在调用处按字段覆写。
 */
function page(overrides: Partial<ReferencePage> = {}): ReferencePage {
  return {
    slug: 'a-page',
    category: 'math',
    title: 'A Page',
    summary: 'A short summary sentence that is still about fifteen words long for the index card title line.',
    description:
      'A slightly longer description for the meta tag, in this case about thirty words long so the page reads as substantive in search results rather than as a stub page nobody bothered to fill in fully.',
    intro:
      'This introductory paragraph walks through the page top to bottom in plain language and gives a reader enough context to know what they are about to look at, why the table or formula below exists, who the page is for, and where it sits in a wider study plan or curriculum across subjects and grades. It deliberately keeps the wording conversational rather than dictionary-like, repeats the title in a milder way, hints at the patterns the page will show, points at the quick start section, says who the page is most useful for, and finishes with a short call to read the next paragraph before jumping straight into the grid. Reading it slowly the first time is faster than working things out from the block alone, and the order matters because each sentence sets up the next so the page does not feel like a dump of facts.',
    blocks: [{ kind: 'table', rows: [['1']] }],
    howToUse: [
      'Look up the row or column you need first, then read the matching cell rather than working it out from scratch, and double-check the unit or sign before you copy the number into your working so you do not pass the next question in spite of knowing the rule.',
      'If your answer is off, retrace the steps in this order and look for the most common slip first rather than restarting the whole problem from the beginning; small mistakes at the start are cheaper to spot than redoing a long piece of working.',
    ],
    faq: [
      {
        q: 'Question one?',
        a: 'An answer that is plenty long enough to count as prose in its own right: it restates the question in milder words, walks through the reasoning one step at a time, gives an example the reader can try, mentions a common confusion to avoid, and closes with a one-line takeaway the reader can hold in their head while they work.',
      },
      {
        q: 'Question two?',
        a: 'Another answer that runs a bit longer so the page\'s total word count clears the bar even when the surrounding copy is short. It covers a second example, names the trap that catches beginners at the start, points at the question on the row below, and finishes by telling the reader which block to flip back to if they want to see the rule applied.',
      },
      {
        q: 'Question three?',
        a: 'A third answer that closes the loop on the same idea from a different angle, talks about how the rule shows up in earlier and later work in the same subject, and tells the reader what page to flip to next in the wider set so the explanation here does not stand alone but instead connects to the rest of the chart library.',
      },
    ],
    related: ['other-page'],
    ...overrides,
  };
}

describe('validateReferencePages', () => {
  it('accepts a well-formed page set', () => {
    const other = page({ slug: 'other-page', related: ['a-page', 'third-page'] });
    const third = page({ slug: 'third-page', related: ['a-page', 'other-page'] });
    expect(() => validateReferencePages([page({ related: ['other-page', 'third-page'] }), other, third])).not.toThrow();
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

  it('rejects a page with fewer than two related links', () => {
    expect(() => validateReferencePages([page({ related: [] })])).toThrow(/at least 2 related/);
  });

  it('rejects a page whose prose is too thin', () => {
    expect(() => validateReferencePages([page({ intro: 'Too short.' })])).toThrow(
      /at least 400 prose words/,
    );
  });

  it('rejects a related slug that no page declares', () => {
    expect(() => validateReferencePages([page({ related: ['ghost'] })])).toThrow(
      /related slug not found: ghost/,
    );
  });

  it('accepts a related slug that a sibling page declares', () => {
    const other = page({ slug: 'other-page', related: ['a-page', 'third-page'] });
    const third = page({ slug: 'third-page', related: ['a-page', 'other-page'] });
    expect(() =>
      validateReferencePages([page({ related: ['other-page', 'a-page'] }), other, third]),
    ).not.toThrow();
  });

  it('reports every problem at once rather than the first', () => {
    const broken = page({ slug: 'broken', title: '', intro: '', blocks: [] });
    expect(() => validateReferencePages([broken])).toThrow(
      /empty title[\s\S]*empty intro[\s\S]*at least one block/,
    );
  });
});
