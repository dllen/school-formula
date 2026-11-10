import { useState } from 'react';
import { TECHNIQUES } from '../data/mastery/techniques';
import type { Technique } from '../data/mastery/types';
import { Icon } from './icons/Icon';

interface Props {
  onSelect: (technique: Technique) => void;
}

const STAGES = ['小学', '中学', '高中'] as const;

export const MasteryLibraryView: React.FC<Props> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = TECHNIQUES.filter(t => {
    if (stageFilter && t.stage !== stageFilter) return false;
    if (search && !t.name.includes(search) && !t.summary.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 sm:w-64">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
          />
          <input
            type="search"
            placeholder="搜索方法…"
            aria-label="搜索方法"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 text-body"
          />
        </div>
        <div className="seg seg--wrap" role="group" aria-label="按学段筛选">
          <button
            type="button"
            aria-pressed={!stageFilter}
            onClick={() => setStageFilter('')}
            className="seg-btn"
          >
            全部
          </button>
          {STAGES.map(s => (
            <button
              key={s}
              type="button"
              aria-pressed={stageFilter === s}
              onClick={() => setStageFilter(stageFilter === s ? '' : s)}
              className="seg-btn"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Icon name="search" className="h-6 w-6" />
          <p className="text-body-s">没有找到匹配的方法</p>
        </div>
      ) : (
        <ul className="grid-tail-span grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {filtered.map(t => {
            const isExpanded = expandedId === t.id;
            const panelId = `technique-panel-${t.id}`;

            return (
              <li
                key={t.id}
                className={`border-b border-divider ${isExpanded ? 'md:col-span-2' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="w-full px-2 py-3 text-left transition-colors hover:bg-paper-2"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-title font-semibold text-ink">{t.name}</span>
                      <span className="mt-1 line-clamp-1 block text-body-s text-ink-2">
                        {t.summary}
                      </span>
                    </span>
                    <Icon
                      name="chevron-down"
                      className={`mt-1 h-4 w-4 shrink-0 text-ink-3 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                  <span className="mt-2 flex flex-wrap gap-2">
                    <span className="tag">{t.stage}</span>
                    <span className="tag">{t.grade}</span>
                  </span>
                </button>

                {isExpanded && (
                  <div id={panelId} className="max-w-prose px-2 pb-5">
                    {t.kou && (
                      <p className="flex items-start gap-2 text-body-s text-ink-2">
                        <Icon name="idea" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                        <span>{t.kou}</span>
                      </p>
                    )}

                    {t.examples && t.examples.length > 0 && (
                      <div className="mt-4">
                        <p className="text-label font-semibold text-ink-2">典型例题</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-body-s text-ink-2 marker:text-ink-3">
                          {t.examples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {t.mistakes && t.mistakes.length > 0 && (
                      <div className="mt-4">
                        <p className="text-label font-semibold text-ink-2">常见错误</p>
                        <ul className="mt-2 space-y-1 text-body-s text-ink-2">
                          {t.mistakes.map((m, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Icon name="cross" className="mt-0.5 h-4 w-4 shrink-0 text-error" />
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {t.realWorld && t.realWorld.length > 0 && (
                      <div className="mt-4">
                        <p className="text-label font-semibold text-ink-2">生活应用</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-body-s text-ink-2 marker:text-ink-3">
                          {t.realWorld.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelect(t)}
                      className="btn btn-primary mt-4"
                    >
                      开始练习
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
