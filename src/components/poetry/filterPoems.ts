import type { Poem, Dynasty, PoemTheme } from '../../data/poems/types';
import type { GradeLevel } from '../../data/types';
import type { DynastyFilter, GradeFilter, ThemeFilter } from '../../data/poems/types';

export interface PoemFilters {
  dynasty: DynastyFilter;
  grade: GradeFilter;
  theme: ThemeFilter;
  query: string;
}

export const DEFAULT_FILTERS: PoemFilters = {
  dynasty: 'all',
  grade: 'all',
  theme: 'all',
  query: '',
};

const VALID_DYNASTIES: ReadonlyArray<Dynasty> = ['tang', 'song'];
const VALID_GRADES: ReadonlyArray<GradeLevel> = ['primary', 'middle', 'high'];
const VALID_THEMES: ReadonlyArray<PoemTheme> = [
  '咏物', '写景', '抒情', '送别', '思乡',
  '边塞', '田园', '咏史', '哲理', '节日',
  '爱情', '闺怨', '讽喻', '其他',
];

function isDynastyFilter(v: string): v is DynastyFilter {
  return v === 'all' || (VALID_DYNASTIES as readonly string[]).includes(v);
}

function isGradeFilter(v: string): v is GradeFilter {
  return v === 'all' || (VALID_GRADES as readonly string[]).includes(v);
}

function isThemeFilter(v: string): v is ThemeFilter {
  return v === 'all' || (VALID_THEMES as readonly string[]).includes(v);
}

export function filterPoems(poems: Poem[], filters: PoemFilters): Poem[] {
  const q = filters.query.trim().toLowerCase();
  return poems.filter((poem) => {
    if (filters.dynasty !== 'all' && poem.dynasty !== filters.dynasty) return false;
    if (filters.grade !== 'all' && poem.grade !== filters.grade) return false;
    if (filters.theme !== 'all' && poem.theme !== filters.theme) return false;
    if (q && !poem.title.toLowerCase().includes(q) && !poem.author.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
}

export function parseFiltersFromSearch(search: URLSearchParams): PoemFilters {
  const dynasty = search.get('dynasty') ?? 'all';
  const grade = search.get('grade') ?? 'all';
  const theme = search.get('theme') ?? 'all';
  const query = search.get('q') ?? '';
  return {
    dynasty: isDynastyFilter(dynasty) ? dynasty : 'all',
    grade: isGradeFilter(grade) ? grade : 'all',
    theme: isThemeFilter(theme) ? theme : 'all',
    query,
  };
}

export function filtersToSearch(filters: PoemFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.dynasty !== 'all') params.set('dynasty', filters.dynasty);
  if (filters.grade !== 'all') params.set('grade', filters.grade);
  if (filters.theme !== 'all') params.set('theme', filters.theme);
  if (filters.query.trim()) params.set('q', filters.query.trim());
  return params;
}