import { useState, type ReactNode } from 'react';
import type {
  DynastyFilter,
  GradeFilter,
  ThemeFilter,
} from '../../data/poems/types';
import type { PoemFilters } from './filterPoems';

interface PoemFiltersProps {
  value: PoemFilters;
  onChange: (filters: PoemFilters) => void;
}

const DYNASTY_OPTIONS: Array<{ value: DynastyFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'tang', label: '唐' },
  { value: 'song', label: '宋' },
];

const GRADE_OPTIONS: Array<{ value: GradeFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'primary', label: '小学' },
  { value: 'middle', label: '初中' },
  { value: 'high', label: '高中' },
];

const THEME_OPTIONS: Array<{ value: ThemeFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: '咏物', label: '咏物' },
  { value: '写景', label: '写景' },
  { value: '抒情', label: '抒情' },
  { value: '送别', label: '送别' },
  { value: '思乡', label: '思乡' },
  { value: '边塞', label: '边塞' },
  { value: '田园', label: '田园' },
  { value: '咏史', label: '咏史' },
];

const THEME_COLLAPSED_COUNT = 8;

/**
 * 筛选是一条条平铺的行：标签在左，分段控件在右，行与行只用发丝线分隔。
 */
export function PoemFilters({ value, onChange }: PoemFiltersProps) {
  const [themeExpanded, setThemeExpanded] = useState(false);
  const visibleThemes = themeExpanded
    ? THEME_OPTIONS
    : THEME_OPTIONS.slice(0, THEME_COLLAPSED_COUNT);

  function set<K extends keyof PoemFilters>(key: K, next: PoemFilters[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <section aria-label="筛选诗词" className="border-y border-divider py-4">
      <div className="flex flex-col gap-3">
        <FilterRow label="朝代">
          <div className="seg" role="group" aria-label="按朝代筛选">
            {DYNASTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={value.dynasty === opt.value}
                onClick={() => set('dynasty', opt.value)}
                className="seg-btn"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterRow>

        <FilterRow label="学段">
          <div className="seg" role="group" aria-label="按学段筛选">
            {GRADE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={value.grade === opt.value}
                onClick={() => set('grade', opt.value)}
                className="seg-btn"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterRow>

        <FilterRow label="题材">
          <div className="seg seg--wrap" role="group" aria-label="按题材筛选">
            {visibleThemes.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={value.theme === opt.value}
                onClick={() => set('theme', opt.value)}
                className="seg-btn"
              >
                {opt.label}
              </button>
            ))}
          </div>
          {THEME_OPTIONS.length > THEME_COLLAPSED_COUNT && (
            <button
              type="button"
              onClick={() => setThemeExpanded((v) => !v)}
              className="btn btn-ghost tap-44"
            >
              {themeExpanded ? '收起' : `展开更多（${THEME_OPTIONS.length - THEME_COLLAPSED_COUNT}）`}
            </button>
          )}
        </FilterRow>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="shrink-0 text-label text-ink-2 sm:w-16">搜索</span>
          <input
            type="search"
            value={value.query}
            onChange={(e) => set('query', e.target.value)}
            placeholder="搜索诗名或作者……"
            aria-label="搜索诗名或作者"
            className="input w-full sm:max-w-sm"
          />
        </div>
      </div>
    </section>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="shrink-0 text-label text-ink-2 sm:w-16">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
