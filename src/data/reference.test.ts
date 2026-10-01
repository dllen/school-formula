import { describe, expect, it } from 'vitest';
import { getReferenceTable, REFERENCE_SLUGS, REFERENCE_TABLES } from './reference';

describe('REFERENCE_TABLES', () => {
  it('has unique, url-safe slugs', () => {
    expect(new Set(REFERENCE_SLUGS).size).toBe(REFERENCE_TABLES.length);
    for (const slug of REFERENCE_SLUGS) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('gives every chart a title, description and non-empty rows', () => {
    for (const table of REFERENCE_TABLES) {
      expect(table.title.length).toBeGreaterThan(0);
      expect(table.description.length).toBeGreaterThan(0);
      expect(table.summary.length).toBeGreaterThan(0);
      expect(table.rows.length).toBeGreaterThan(0);
    }
  });

  it('keeps every row the same width as its headers', () => {
    for (const table of REFERENCE_TABLES) {
      if (!table.headers) continue;
      for (const row of table.rows) {
        expect(row).toHaveLength(table.headers.length);
      }
    }
  });

  it('generates the 1–12 multiplication chart', () => {
    const chart = getReferenceTable('multiplication-chart');
    expect(chart?.rows).toHaveLength(12);
    expect(chart?.rows[11][12]).toBe('144');
  });

  it('looks tables up by slug', () => {
    expect(getReferenceTable('physics-constants')?.title).toBe('Physical Constants');
    expect(getReferenceTable('does-not-exist')).toBeUndefined();
  });
});
