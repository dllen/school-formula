import { useState, useEffect } from 'react';
import { loadProgress, getWeakTechniques, getReviewTechniques, getWeeklyActivity } from '../data/mastery/progress';
import { TECHNIQUES } from '../data/mastery/techniques';
import type { MasteryProgress } from '../data/mastery/types';

export const MasteryProgressView: React.FC = () => {
  const [progress, setProgress] = useState<MasteryProgress>({ records: {}, completedTechniques: [] });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setProgress(loadProgress()); }, []);

  const weak = getWeakTechniques();
  const review = getReviewTechniques();
  const weekly = getWeeklyActivity();
  const totalMastered = progress.completedTechniques.length;
  const totalTechniques = TECHNIQUES.length;
  const pct = totalTechniques > 0 ? Math.round((totalMastered / totalTechniques) * 100) : 0;

  const totalAttempts = Object.values(progress.records).reduce((sum, r) => sum + r.totalAttempts, 0);
  const totalCorrect = Object.values(progress.records).reduce((sum, r) => sum + r.correctCount, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const maxAttempts = Math.max(...weekly.map(d => d.attempts), 1);

  return (
    <div className="space-y-6">
      {/* 总览卡片 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg width="80" height="80" className="transform -rotate-90">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
              <circle cx="40" cy="40" r="35" fill="none" stroke={pct >= 60 ? '#22c55e' : pct >= 30 ? '#eab308' : '#ef4444'}
                strokeWidth="6" strokeDasharray={`${pct * 2.2} 220`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{pct}%</span>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-gray-900">{totalMastered} / {totalTechniques}</p>
            <p className="text-sm text-gray-500">已通关方法</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-gray-500">总练习 <span className="font-semibold text-gray-700">{totalAttempts}</span> 题</span>
              <span className="text-xs text-gray-500">正确率 <span className="font-semibold text-gray-700">{overallAccuracy}%</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 7 天趋势 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">📈 近 7 天练习趋势</h3>
        <div className="flex items-end gap-2 h-24">
          {weekly.map((day, i) => {
            const height = day.attempts > 0 ? Math.max((day.attempts / maxAttempts) * 100, 8) : 4;
            const isToday = i === weekly.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{day.attempts > 0 ? day.attempts : ''}</span>
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    day.attempts > 0
                      ? isToday ? 'bg-blue-500' : 'bg-blue-200'
                      : 'bg-gray-100'
                  }`}
                  style={{ height: `${height}%` }}
                />
                <span className={`text-xs ${isToday ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  {day.date}
                </span>
              </div>
            );
          })}
        </div>
        {totalAttempts === 0 && (
          <p className="text-center text-xs text-gray-400 mt-3">完成一次练习后这里会显示趋势图</p>
        )}
      </div>

      {/* 薄弱方法 */}
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

      {/* 需要复习 */}
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

      {totalMastered === 0 && totalAttempts === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>还没有练习记录，快去学习路径开始第一个方法吧！</p>
        </div>
      )}
    </div>
  );
};
