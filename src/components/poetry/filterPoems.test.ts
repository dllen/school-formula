import { describe, expect, it } from 'vitest';
import {
  filterPoems,
  parseFiltersFromSearch,
  filtersToSearch,
  type PoemFilters,
} from './filterPoems';
import type { Poem } from '../../data/poems';

const poems: Poem[] = [
  {
    id: 'primary-tang-jing-ye-si',
    title: '静夜思',
    author: '李白',
    dynasty: 'tang',
    form: '五言绝句',
    grade: 'primary',
    content: ['床前明月光'],
    pinyin: ['chuáng qián míng yuè guāng'],
    translation: '明亮的月光。',
    appreciation: '思乡名作。',
    theme: '思乡',
  },
  {
    id: 'middle-song-ru-meng-ling',
    title: '如梦令',
    author: '李清照',
    dynasty: 'song',
    form: '词',
    grade: 'middle',
    cipai: '如梦令',
    content: ['常记溪亭日暮'],
    pinyin: ['cháng jì xī tíng rì mù'],
    translation: '经常记起。',
    appreciation: '早期名作。',
    theme: '抒情',
  },
];

const ALL: PoemFilters = { dynasty: 'all', grade: 'all', theme: 'all', query: '' };

describe('filterPoems', () => {
  it('returns all poems when all filters are all', () => {
    expect(filterPoems(poems, ALL)).toHaveLength(2);
  });

  it('filters by dynasty=tang', () => {
    const result = filterPoems(poems, { ...ALL, dynasty: 'tang' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('primary-tang-jing-ye-si');
  });

  it('filters by dynasty=song', () => {
    const result = filterPoems(poems, { ...ALL, dynasty: 'song' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('middle-song-ru-meng-ling');
  });

  it('filters by grade=primary', () => {
    const result = filterPoems(poems, { ...ALL, grade: 'primary' });
    expect(result.map((p) => p.id)).toEqual(['primary-tang-jing-ye-si']);
  });

  it('combines dynasty AND grade AND theme', () => {
    const result = filterPoems(poems, {
      dynasty: 'tang',
      grade: 'primary',
      theme: '思乡',
      query: '',
    });
    expect(result).toHaveLength(1);
  });

  it('returns empty array when no match', () => {
    const result = filterPoems(poems, { ...ALL, dynasty: 'tang', grade: 'high' });
    expect(result).toEqual([]);
  });

  it('filters by query matching title', () => {
    const result = filterPoems(poems, { ...ALL, query: '静夜' });
    expect(result).toHaveLength(1);
  });

  it('filters by query matching author (Chinese)', () => {
    // Ruling: case-insensitive Latin→CJK transliteration isn't supported
    // (String#toLowerCase doesn't transliterate). Users search Chinese names
    // directly, so test that path.
    const result = filterPoems(poems, { ...ALL, query: '李' });
    expect(result).toHaveLength(2); // both authors start with 李
  });
});

describe('URL serialization round-trip', () => {
  it('parseFiltersFromSearch returns all defaults on empty params', () => {
    const search = new URLSearchParams('');
    expect(parseFiltersFromSearch(search)).toEqual(ALL);
  });

  it('filtersToSearch then parseFiltersFromSearch is identity', () => {
    const filters: PoemFilters = {
      dynasty: 'tang',
      grade: 'primary',
      theme: '思乡',
      query: '静夜',
    };
    const search = filtersToSearch(filters);
    const parsed = parseFiltersFromSearch(search);
    expect(parsed).toEqual(filters);
  });

  it('filtersToSearch drops default values', () => {
    const search = filtersToSearch(ALL);
    expect(search.toString()).toBe('');
  });

  it('filtersToSearch encodes theme in URL', () => {
    const search = filtersToSearch({ ...ALL, theme: '思乡' });
    expect(search.get('theme')).toBe('思乡');
  });
});