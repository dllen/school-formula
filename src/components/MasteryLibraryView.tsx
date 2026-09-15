import { useState } from 'react';
import { TECHNIQUES } from '../data/mastery/techniques';
import type { Technique } from '../data/mastery/types';

interface Props {
  onSelect: (technique: Technique) => void;
}

export const MasteryLibraryView: React.FC<Props> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = TECHNIQUES.filter(t => {
    if (stageFilter && t.stage !== stageFilter) return false;
    if (search && !t.name.includes(search) && !t.summary.includes(search)) return false;
    return true;
  });

  const stages = ['小学', '中学', '高中'] as const;
  const stageColors = {
    小学: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    中学: 'bg-sky-50 text-sky-700 border-sky-100',
    高中: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="搜索方法..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
        />
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setStageFilter('')}
            className={`px-2 py-1 text-xs rounded-md transition-all ${!stageFilter ? 'bg-white shadow text-gray-800 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            全部
          </button>
          {stages.map(s => (
            <button
              key={s}
              onClick={() => setStageFilter(stageFilter === s ? '' : s)}
              className={`px-2 py-1 text-xs rounded-md transition-all ${stageFilter === s ? 'bg-white shadow text-gray-800 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-8 text-gray-400 text-sm">没有找到匹配的方法</p>
      )}

      <div className="space-y-2">
        {filtered.map(t => {
          const isExpanded = expandedId === t.id;
          return (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all hover:shadow-sm"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : t.id)}
                className="w-full text-left px-4 py-3 flex items-center gap-3"
              >
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${stageColors[t.stage]}`}>
                  {t.stage}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{t.name}</span>
                    <span className="text-xs text-gray-400">{t.grade}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{t.summary}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-50">
                  {t.kou && (
                    <div className="pt-3">
                      <p className="text-xs text-amber-600 italic leading-relaxed">💡 {t.kou}</p>
                    </div>
                  )}

                  {t.examples && t.examples.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
                        典型例题
                      </p>
                      <ul className="space-y-1">
                        {t.examples.map((ex, i) => (
                          <li key={i} className="text-xs text-gray-600 pl-3 py-1 bg-blue-50/50 rounded-md leading-relaxed">
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {t.mistakes && t.mistakes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
                        常见错误
                      </p>
                      <ul className="space-y-1">
                        {t.mistakes.map((m, i) => (
                          <li key={i} className="text-xs text-gray-600 pl-3 py-1 bg-red-50/50 rounded-md leading-relaxed flex items-start gap-1">
                            <span className="text-red-400 mt-0.5">×</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {t.realWorld && t.realWorld.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                        生活应用
                      </p>
                      <ul className="space-y-1">
                        {t.realWorld.map((r, i) => (
                          <li key={i} className="text-xs text-gray-600 pl-3 py-1 bg-green-50/50 rounded-md leading-relaxed flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">→</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => onSelect(t)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      开始练习 →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
