import { useState } from 'react';
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

export function PoemFilters({ value, onChange }: PoemFiltersProps) {
  const [themeExpanded, setThemeExpanded] = useState(false);
  const visibleThemes = themeExpanded
    ? THEME_OPTIONS
    : THEME_OPTIONS.slice(0, THEME_COLLAPSED_COUNT);

  function set<K extends keyof PoemFilters>(key: K, next: PoemFilters[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F0F1F2] p-5 space-y-3">
      <FilterRow label="朝代">
        {DYNASTY_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            active={value.dynasty === opt.value}
            onClick={() => set('dynasty', opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
      </FilterRow>
      <FilterRow label="学段">
        {GRADE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            active={value.grade === opt.value}
            onClick={() => set('grade', opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
      </FilterRow>
      <FilterRow label="题材">
        {visibleThemes.map((opt) => (
          <Chip
            key={opt.value}
            active={value.theme === opt.value}
            onClick={() => set('theme', opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
        {THEME_OPTIONS.length > THEME_COLLAPSED_COUNT && (
          <button
            type="button"
            onClick={() => setThemeExpanded((v) => !v)}
            className="text-xs text-[#3370FF] hover:underline px-2"
          >
            {themeExpanded ? '收起' : `展开更多（${THEME_OPTIONS.length - THEME_COLLAPSED_COUNT}）`}
          </button>
        )}
      </FilterRow>
      <div className="pt-2">
        <input
          type="search"
          value={value.query}
          onChange={(e) => set('query', e.target.value)}
          placeholder="搜索诗名或作者……"
          aria-label="搜索诗名或作者"
          className="w-full px-4 py-2 border border-[#E5E6EB] rounded-lg text-sm focus:outline-none focus:border-[#3370FF] focus:ring-2 focus:ring-[#E1EAFF]"
        />
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm text-[#646A73] shrink-0 pt-1 w-12">{label}</span>
      <div className="flex flex-wrap gap-2 flex-1">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1 text-xs rounded-full transition-colors ${
        active
          ? 'bg-[#3370FF] text-white'
          : 'bg-[#F5F6F7] text-[#646A73] hover:bg-[#E1EAFF] hover:text-[#3370FF]'
      }`}
    >
      {children}
    </button>
  );
}