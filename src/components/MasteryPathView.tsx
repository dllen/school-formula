import { useState, useMemo } from 'react';
import { TECHNIQUES, getLearningPath } from '../data/mastery/techniques';
import { loadProgress } from '../data/mastery/progress';
import type { Technique, MasteryProgress } from '../data/mastery/types';
import { Icon } from './icons/Icon';

interface Props {
  onSelect: (technique: Technique) => void;
}

type PathStatus = 'locked' | 'unlocked' | 'learning' | 'completed';

const STATUS_LABEL: Record<PathStatus, string> = {
  completed: '已完成',
  learning: '学习中',
  unlocked: '可开始',
  locked: '完成前置后解锁',
};

/* The row's state is carried by its left hairline and by a text label,
   never by a decorative dot. */
const STATUS_EDGE: Record<PathStatus, string> = {
  completed: 'border-l-success',
  learning: 'border-l-warning',
  unlocked: 'border-l-rule-strong',
  locked: 'border-l-divider',
};

const STATUS_TEXT: Record<PathStatus, string> = {
  completed: 'text-success-ink',
  learning: 'text-warning-ink',
  unlocked: 'text-ink-2',
  locked: 'text-ink-3',
};

export const MasteryPathView: React.FC<Props> = ({ onSelect }) => {
  const [progress] = useState<MasteryProgress>(() => loadProgress());

  const path = useMemo(() => getLearningPath(), []);
  const map = useMemo(() => new Map(TECHNIQUES.map(t => [t.id, t])), []);

  const getStatus = (t: Technique): PathStatus => {
    if (progress.completedTechniques.includes(t.id)) return 'completed';
    if (t.prereq && !progress.completedTechniques.includes(t.prereq)) return 'locked';
    if (progress.records[t.id]) return 'learning';
    return 'unlocked';
  };

  const stages = ['小学', '中学', '高中'] as const;

  return (
    <div className="space-y-10">
      <p className="max-w-prose text-body-s text-ink-2">
        按依赖关系排列的学习路径。完成前置方法后才能解锁下一个。
      </p>

      {stages.map(stage => {
        const items = path.filter(t => t.stage === stage);
        if (items.length === 0) return null;

        return (
          <section key={stage} aria-labelledby={`path-stage-${stage}`}>
            <div className="index-head">
              <h2 id={`path-stage-${stage}`} className="index-title">
                {stage}
              </h2>
              <span className="index-meta">{items.length} 个方法</span>
            </div>

            <ul>
              {items.map(t => {
                const status = getStatus(t);
                const prereq = t.prereq ? map.get(t.prereq) : null;
                const locked = status === 'locked';

                return (
                  <li key={t.id} className="border-b border-divider">
                    <button
                      type="button"
                      onClick={() => {
                        if (!locked) onSelect(t);
                      }}
                      aria-disabled={locked || undefined}
                      className={`flex w-full items-center gap-4 border-l-2 py-3 pl-3 pr-2 text-left transition-colors ${STATUS_EDGE[status]} ${
                        locked ? 'cursor-not-allowed' : 'hover:bg-paper-2'
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-title font-semibold ${
                            locked ? 'text-ink-3' : 'text-ink'
                          }`}
                        >
                          {t.name}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-3">
                          <span>{t.grade}</span>
                          {prereq && <span>前置：{prereq.name}</span>}
                        </span>
                      </span>

                      <span
                        className={`flex shrink-0 items-center gap-1.5 text-caption ${STATUS_TEXT[status]}`}
                      >
                        {status === 'completed' && <Icon name="check-circle" className="h-4 w-4" />}
                        {status === 'locked' && <Icon name="key" className="h-4 w-4" />}
                        {STATUS_LABEL[status]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
};
