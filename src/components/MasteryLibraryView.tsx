import { useState } from 'react';
import { TECHNIQUES } from '../../data/mastery/techniques';
import type { Technique } from '../../data/mastery/types';

interface Props {
  onSelect: (technique: Technique) => void;
}

export const MasteryLibraryView: React.FC<Props> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  const filtered = TECHNIQUES.filter(t => {
    if (stageFilter && t.stage !== stageFilter) return false;
    if (search && !t.name.includes(search) && !t.summary.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="text" placeholder="搜索方法..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">全部</option>
          <option value="小学">小学</option>
          <option value="中学">中学</option>
          <option value="高中">高中</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(t => (
          <button key={t.id} onClick={() => onSelect(t)}
            className="text-left bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{t.grade}</span>
              <span className="font-medium text-gray-900">{t.name}</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{t.summary}</p>
            {t.kou && <p className="text-xs text-amber-600 mt-2 italic">&ldquo;{t.kou}&rdquo;</p>}
          </button>
        ))}
      </div>
    </div>
  );
};
