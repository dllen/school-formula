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
import { Icon } from '../icons/Icon';

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
      <div className="mx-auto w-full max-w-[68ch]">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="btn btn-ghost -ml-2"
        >
          返回列表
        </button>
        <PoemContent poem={selected} />
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">古诗词</h1>
          <p className="page-lead">浏览新课标必背唐诗宋词</p>
        </div>
      </div>

      <FiltersBar value={filters} onChange={setFilters} />

      <p className="tabular mt-6 text-label font-semibold text-ink-2">
        共 {poems.length} 首
      </p>

      {poems.length > 0 ? (
        <ul className="mt-2 grid grid-cols-1 gap-x-10 border-t border-divider lg:grid-cols-3">
          {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} onClick={() => setSelected(poem)} />
          ))}
        </ul>
      ) : (
        <div className="empty-state mt-6">
          <Icon name="scroll" className="h-10 w-10 text-ink-3" />
          <p className="text-body-s text-ink-2">暂无符合条件的诗词</p>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="btn btn-secondary"
          >
            清除筛选
          </button>
        </div>
      )}
    </>
  );
}

/**
 * 详情模式用 URL hash 存储选中 poem id，而不是 component state。
 * 这样浏览器后退按钮可以关掉详情（spec §6.2 modal 复用 PoemContent 的实现）。
 */
function useHashPoem(): [Poem | null, (poem: Poem | null) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const search = location.search;
  const hashId = location.hash.replace(/^#/, '');
  const poem = hashId ? ALL_POEMS.find((p) => p.id === hashId) ?? null : null;
  const setPoem = (next: Poem | null) => {
    if (next) navigate({ search, hash: next.id });
    else navigate({ search, hash: '' });
  };
  return [poem, setPoem];
}
