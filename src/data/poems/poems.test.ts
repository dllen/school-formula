import { describe, expect, it } from 'vitest';
import {
  ALL_POEMS,
  POEMS_BY_ID,
  getPoemById,
  getPoemsByGrade,
} from './index';

describe('Poem data integrity', () => {
  it('every poem has content.length equal to pinyin.length', () => {
    for (const poem of ALL_POEMS) {
      expect(poem.content.length, `poem ${poem.id}`).toBe(poem.pinyin.length);
    }
  });

  it('no duplicate IDs across ALL_POEMS', () => {
    const ids = ALL_POEMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('POEMS_BY_ID lookup matches getPoemById', () => {
    for (const poem of ALL_POEMS) {
      expect(POEMS_BY_ID[poem.id]).toBe(poem);
      expect(getPoemById(poem.id)).toBe(poem);
    }
  });

  it('every poem has id matching <grade>-<dynasty>-<slug>', () => {
    for (const poem of ALL_POEMS) {
      expect(poem.id).toMatch(/^(primary|middle|high)-(tang|song)-[a-z0-9-]+$/);
    }
  });

  it('cipai is set iff form is 词', () => {
    for (const poem of ALL_POEMS) {
      if (poem.form === '词') {
        expect(poem.cipai, `poem ${poem.id} is 词 but missing cipai`).toBeTruthy();
      } else {
        expect(poem.cipai, `poem ${poem.id} is not 词 but has cipai`).toBeUndefined();
      }
    }
  });

  it('every poem has translation and appreciation longer than 10 chars', () => {
    for (const poem of ALL_POEMS) {
      expect(poem.translation.length, `poem ${poem.id}.translation`).toBeGreaterThan(10);
      expect(poem.appreciation.length, `poem ${poem.id}.appreciation`).toBeGreaterThan(10);
    }
  });
});

describe('Poem query functions', () => {
  it('getPoemsByGrade returns subset for primary', () => {
    const primary = getPoemsByGrade('primary');
    expect(primary.length).toBeGreaterThan(0);
    for (const poem of primary) {
      expect(poem.grade).toBe('primary');
    }
  });

  it('getPoemsByGrade returns subset for middle', () => {
    const middle = getPoemsByGrade('middle');
    expect(middle.length).toBeGreaterThan(0);
    for (const poem of middle) {
      expect(poem.grade).toBe('middle');
    }
  });

  it('getPoemsByGrade returns subset for high', () => {
    const high = getPoemsByGrade('high');
    expect(high.length).toBeGreaterThan(0);
    for (const poem of high) {
      expect(poem.grade).toBe('high');
    }
  });

  it('getPoemById returns undefined for unknown id', () => {
    expect(getPoemById('primary-tang-does-not-exist')).toBeUndefined();
  });
});