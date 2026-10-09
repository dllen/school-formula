import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ALL_POEMS } from '../../data/poems';
import {
  DEFAULT_FILTERS,
  filterPoems,
  filtersToSearch,
  parseFiltersFromSearch,
  type PoemFilters,
} from './filterPoems';
import { PoemCard } from './PoemCard';
import { PoemContent } from './PoemContent';
import { PoemFilters as FiltersBar } from './PoemFilters';
import type { Poem } from '../../data/poems/types';

export function PoetryView() {
  const location = useLocation();
  const navigate = useNavigate();

  const filters: PoemFilters = useMemo(
    () => parseFiltersFromSearch(new URLSearchParams(location.search)),
    [location.search],
  );

  const setFilters = useCallback(
    (next: PoemFilters) => {
      const params = filtersToSearch(next);
      const qs = params.toString();
      navigate(qs ? `/poetry?${qs}` : '/poetry', { replace: true });
    },
    [navigate],
  );

  const poems = useMemo(() => filterPoems(ALL_POEMS, filters), [filters]);
  const [selected, setSelected] = useHashPoem();

  if (selected) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#F0F1F2]">
        <BackBar onBack={() => setSelected(null)} />
        <PoemContent poem={selected} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2329]">古诗词</h2>
          <p className="text-sm text-[#646A73]">浏览新课标必背唐诗宋词</p>
        </div>
      </header>

      <FiltersBar value={filters} onChange={setFilters} />

      {poems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} onClick={() => setSelected(poem)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#F5F6F7] rounded-2xl border border-dashed border-[#E5E6EB]">
          <div className="text-6xl mb-4 grayscale opacity-30">📜</div>
          <p className="text-lg text-[#8F959E] mb-4">暂无符合条件的诗词</p>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-sm text-[#3370FF] hover:underline"
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  );
}

function BackBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-4 sm:px-6 pt-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-[#646A73] hover:text-[#1F2329] transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回列表
      </button>
    </div>
  );
}

/**
 * 详情模式用 URL hash 存储选中 poem id，而不是 component state。
 * 这样浏览器后退按钮可以关掉详情（spec §6.2 modal 复用 PoemContent 的实现）。
 */
function useHashPoem(): [Poem | null, (poem: Poem | null) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const hashId = location.hash.replace(/^#/, '');
  const poem = hashId ? ALL_POEMS.find((p) => p.id === hashId) ?? null : null;
  const setPoem = (next: Poem | null) => {
    if (next) navigate({ hash: next.id });
    else navigate({ hash: '' });
  };
  return [poem, setPoem];
}