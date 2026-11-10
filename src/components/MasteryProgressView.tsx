import { useState, useEffect } from 'react';
import { loadProgress, getWeakTechniques, getReviewTechniques, getWeeklyActivity } from '../data/mastery/progress';
import { TECHNIQUES } from '../data/mastery/techniques';
import type { MasteryProgress } from '../data/mastery/types';
import { Icon } from './icons/Icon';

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
      <div className="bg-white rounded-2xl border border-paper-3 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg width="80" height="80" className="transform -rotate-90" aria-hidden="true">
              <circle cx="40" cy="40" r="35" fill="none" className="text-paper-3" stroke="currentColor" strokeWidth="6" />
              <circle cx="40" cy="40" r="35" fill="none" className={pct >= 60 ? 'text-success' : pct >= 30 ? 'text-warning' : 'text-error'} stroke="currentColor"
                strokeWidth="6" strokeDasharray={`${pct * 2.2} 220`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{pct}%</span>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-ink">{totalMastered} / {totalTechniques}</p>
            <p className="text-sm text-ink-3">已通关方法</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-ink-3">总练习 <span className="font-semibold text-ink-2">{totalAttempts}</span> 题</span>
              <span className="text-xs text-ink-3">正确率 <span className="font-semibold text-ink-2">{overallAccuracy}%</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 7 天趋势 */}
      <div className="bg-white rounded-2xl border border-paper-3 p-6">
        <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><Icon name="chart" className="w-5 h-5" />近 7 天练习趋势</h3>
        <div className="flex items-end gap-2 h-24">
          {weekly.map((day, i) => {
            const height = day.attempts > 0 ? Math.max((day.attempts / maxAttempts) * 100, 8) : 4;
            const isToday = i === weekly.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-ink-3 font-medium">{day.attempts > 0 ? day.attempts : ''}</span>
                <div
                  className={`w-full rounded-t-md transition-colors duration-300 ${
                    day.attempts > 0
                      ? isToday ? 'bg-accent' : 'bg-accent-soft-hover'
                      : 'bg-paper-3'
                  }`}
                  style={{ height: `${height}%` }}
                />
                <span className={`text-xs ${isToday ? 'text-accent font-medium' : 'text-ink-3'}`}>
                  {day.date}
                </span>
              </div>
            );
          })}
        </div>
        {totalAttempts === 0 && (
          <p className="text-center text-xs text-ink-3 mt-3">完成一次练习后这里会显示趋势图</p>
        )}
      </div>

      {/* 薄弱方法 */}
      {weak.length > 0 && (
        <div className="bg-error-bg rounded-2xl border border-error-bg p-4">
          <h3 className="font-bold text-error-ink mb-2 flex items-center gap-2"><Icon name="shield" className="w-5 h-5" />薄弱方法（正确率 &lt; 60%）</h3>
          <div className="flex flex-wrap gap-2">
            {weak.map(id => {
              const t = TECHNIQUES.find(x => x.id === id);
              return t ? <span key={id} className="px-2 py-1 bg-white rounded text-xs text-error-ink">{t.name}</span> : null;
            })}
          </div>
        </div>
      )}

      {/* 需要复习 */}
      {review.length > 0 && (
        <div className="bg-warning-bg rounded-2xl border border-warning-bg p-4">
          <h3 className="font-bold text-warning-ink mb-2 flex items-center gap-2"><Icon name="route" className="w-5 h-5" />需要复习（3天未练习）</h3>
          <div className="flex flex-wrap gap-2">
            {review.map(id => {
              const t = TECHNIQUES.find(x => x.id === id);
              return t ? <span key={id} className="px-2 py-1 bg-white rounded text-xs text-warning-ink">{t.name}</span> : null;
            })}
          </div>
        </div>
      )}

      {totalMastered === 0 && totalAttempts === 0 && (
        <div className="text-center py-8 text-ink-3">
          <p>还没有练习记录，快去学习路径开始第一个方法吧！</p>
        </div>
      )}
    </div>
  );
};
