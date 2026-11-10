import { useState, useMemo } from 'react';
import { TECHNIQUES, getLearningPath } from '../data/mastery/techniques';
import { loadProgress } from '../data/mastery/progress';
import type { Technique, MasteryProgress } from '../data/mastery/types';
import { Icon } from './icons/Icon';

interface Props {
  onSelect: (technique: Technique) => void;
}

export const MasteryPathView: React.FC<Props> = ({ onSelect }) => {
  const [progress] = useState<MasteryProgress>(() => loadProgress());

  const path = useMemo(() => getLearningPath(), []);
  const map = useMemo(() => new Map(TECHNIQUES.map(t => [t.id, t])), []);

  const getStatus = (t: Technique): 'locked' | 'unlocked' | 'learning' | 'completed' => {
    if (progress.completedTechniques.includes(t.id)) return 'completed';
    if (t.prereq && !progress.completedTechniques.includes(t.prereq)) return 'locked';
    if (progress.records[t.id]) return 'learning';
    return 'unlocked';
  };

  const stages = ['小学', '中学', '高中'] as const;
  const stageColors = {
    小学: 'border-l-emerald-400',
    中学: 'border-l-sky-400',
    高中: 'border-l-amber-400',
  };

  return (
    <div className="space-y-8">
      <p className="text-ink-3">按依赖关系排列的学习路径。完成前置方法后才能解锁下一个。</p>
      {stages.map(stage => {
        const items = path.filter(t => t.stage === stage);
        if (items.length === 0) return null;
        return (
          <div key={stage}>
            <h3 className="text-lg font-gray-800 font-bold mb-3">{stage}</h3>
            <div className="relative pl-6 space-y-2">
              {items.map(t => {
                const status = getStatus(t);
                const prereq = t.prereq ? map.get(t.prereq) : null;
                const base = 'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors text-left';
                const stageBorder = stageColors[t.stage];
                const styles = {
                  completed: `bg-success-bg border-success-bg ${stageBorder}`,
                  learning: `bg-warning-bg border-warning-bg ${stageBorder}`,
                  unlocked: `bg-white border-paper-3 cursor-pointer hover:border-accent-soft-hover hover:shadow-sm ${stageBorder}`,
                  locked: `bg-paper-2 border-paper-3 opacity-50 cursor-not-allowed ${stageBorder}`,
                };

                return (
                  <div key={t.id} className="relative flex items-center">
                    {/* 前置连线 */}
                    {prereq && (
                      <div className="absolute -top-2 left-2 w-px h-2 bg-rule" />
                    )}
                    <button
                      className={`${base} ${styles[status]}`}
                      onClick={() => status !== 'locked' && onSelect(t)}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        status === 'completed' ? 'bg-success' :
                        status === 'learning' ? 'bg-warning' :
                        status === 'unlocked' ? 'bg-accent-hover' : 'bg-rule-strong'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{t.name}</span>
                        {prereq && (
                          <span className="text-xs text-ink-3 ml-2">前置：{prereq.name}</span>
                        )}
                      </div>
                      <span className="text-xs text-ink-3">{t.grade}</span>
                      <span className="text-xs">
                        {status === 'completed' ? (
                          <Icon name="check-circle" className="w-4 h-4 text-success" />
                        ) : status === 'locked' ? (
                          <Icon name="key" className="w-4 h-4 text-ink-3" />
                        ) : null}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
