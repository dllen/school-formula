import { useState, useEffect } from 'react';
import { loadProgress, getWeakTechniques, getReviewTechniques } from '../../data/mastery/progress';
import { TECHNIQUES } from '../../data/mastery/techniques';
import type { MasteryProgress } from '../../data/mastery/types';

export const MasteryProgressView: React.FC = () => {
  const [progress, setProgress] = useState<MasteryProgress>({ records: {}, completedTechniques: [] });

  useEffect(() => { setProgress(loadProgress()); }, []);

  const weak = getWeakTechniques();
  const review = getReviewTechniques();
  const totalMastered = progress.completedTechniques.length;
  const totalTechniques = TECHNIQUES.length;
  const pct = totalTechniques > 0 ? Math.round((totalMastered / totalTechniques) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6">
        <div className="relative">
          <svg width="80" height="80" className="transform -rotate-90">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle cx="40" cy="40" r="35" fill="none" stroke={pct >= 60 ? '#22c55e' : pct >= 30 ? '#eab308' : '#ef4444'}
              strokeWidth="6" strokeDasharray={`${pct * 2.2} 220`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{pct}%</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{totalMastered} / {totalTechniques}</p>
          <p className="text-sm text-gray-500">已通关方法</p>
        </div>
      </div>

      {weak.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
          <h3 className="font-bold text-red-800 mb-2">⚠️ 薄弱方法（正确率 &lt; 60%）</h3>
          <div className="flex flex-wrap gap-2">
            {weak.map(id => {
              const t = TECHNIQUES.find(x => x.id === id);
              return t ? <span key={id} className="px-2 py-1 bg-white rounded text-xs text-red-700">{t.name}</span> : null;
            })}
          </div>
        </div>
      )}

      {review.length > 0 && (
        <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-4">
          <h3 className="font-bold text-yellow-800 mb-2">🔄 需要复习（3天未练习）</h3>
          <div className="flex flex-wrap gap-2">
            {review.map(id => {
              const t = TECHNIQUES.find(x => x.id === id);
              return t ? <span key={id} className="px-2 py-1 bg-white rounded text-xs text-yellow-700">{t.name}</span> : null;
            })}
          </div>
        </div>
      )}

      {totalMastered === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>还没有练习记录，快去学习路径开始第一个方法吧！</p>
        </div>
      )}
    </div>
  );
};
