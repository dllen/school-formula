import { useState, useEffect } from 'react';
import { TECHNIQUES } from '../data/mastery/techniques';
import { loadProgress } from '../data/mastery/progress';
import type { Technique, MasteryProgress } from '../data/mastery/types';

interface Props {
  onSelect: (technique: Technique) => void;
}

export const MasteryPathView: React.FC<Props> = ({ onSelect }) => {
  const [progress, setProgress] = useState<MasteryProgress>({ records: {}, completedTechniques: [] });

  useEffect(() => { setProgress(loadProgress()); }, []);

  const getStatus = (t: Technique): 'locked' | 'unlocked' | 'learning' | 'completed' => {
    if (progress.completedTechniques.includes(t.id)) return 'completed';
    if (t.prereq && !progress.completedTechniques.includes(t.prereq)) return 'locked';
    if (progress.records[t.id]) return 'learning';
    return 'unlocked';
  };

  const stages = ['小学', '中学', '高中'] as const;

  return (
    <div className="space-y-8">
      <p className="text-gray-500">按依赖关系排列的学习路径。完成前置方法后才能解锁下一个。</p>
      {stages.map(stage => {
        const items = TECHNIQUES.filter(t => t.stage === stage);
        if (items.length === 0) return null;
        return (
          <div key={stage}>
            <h3 className="text-lg font-bold text-gray-800 mb-3">{stage}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map(t => {
                const status = getStatus(t);
                const base = 'px-3 py-1.5 rounded-full text-xs font-medium transition-all';
                const styles = {
                  completed: 'bg-green-100 text-green-700 border border-green-200',
                  learning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
                  unlocked: 'bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer hover:bg-blue-200',
                  locked: 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60',
                };
                return (
                  <button key={t.id} className={`${base} ${styles[status]}`}
                    onClick={() => status !== 'locked' && onSelect(t)}>
                    {t.name}{status === 'completed' ? ' ✓' : status === 'locked' ? ' 🔒' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
