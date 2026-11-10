import React, { useState, useEffect } from 'react';
import type { LearningProgress } from '../../hooks/useLearningProgress';
import { formatTime } from '../../utils/questionUtils';
import { Icon } from '../icons/Icon';

interface ProgressDashboardProps {
  progress: LearningProgress;
  todayStats: { answered: number; correct: number; timeSpent: number };
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress, todayStats }) => {
  const overallAccuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  const [last7Days, setLast7Days] = useState<string[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe: render empty on server, populate after mount
    setLast7Days(Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400000);
      return d.toISOString().split('T')[0];
    }));
  }, []);

  return (
    <div className="bg-white rounded-lg border border-rule p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-ink">学习进度</h2>
        <p className="text-sm text-ink-3 mt-0.5">坚持每天练习，积少成多</p>
      </div>

      {/* Streak */}
      {progress.currentStreak > 0 && (
        <div className="bg-warning-bg border border-warning-bg rounded-md p-3 flex items-center gap-3">
          <Icon name="flame" className="w-6 h-6 text-warning" />
          <div>
            <div className="text-base font-semibold text-warning-ink">
              连续学习 {progress.currentStreak} 天
            </div>
            <div className="text-xs text-warning">
              最长记录：{progress.longestStreak} 天
            </div>
          </div>
        </div>
      )}

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-paper-2 rounded-md p-3 text-center ring-1 ring-paper-3">
          <div className="text-xl font-bold text-ink">{todayStats.answered}</div>
          <div className="text-xs text-ink-3 mt-0.5">今日答题</div>
        </div>
        <div className="bg-paper-2 rounded-md p-3 text-center ring-1 ring-paper-3">
          <div className="text-xl font-bold text-success-ink">{todayStats.correct}</div>
          <div className="text-xs text-ink-3 mt-0.5">今日正确</div>
        </div>
        <div className="bg-paper-2 rounded-md p-3 text-center ring-1 ring-paper-3">
          <div className="text-xl font-bold text-ink">{formatTime(todayStats.timeSpent)}</div>
          <div className="text-xs text-ink-3 mt-0.5">今日用时</div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-ink">{progress.totalAnswered}</div>
          <div className="text-xs text-ink-3">累计答题</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-ink">{overallAccuracy}%</div>
          <div className="text-xs text-ink-3">总正确率</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-ink">{formatTime(progress.totalTimeSpent)}</div>
          <div className="text-xs text-ink-3">累计用时</div>
        </div>
      </div>

      {/* 7-Day Activity */}
      <div>
        <h3 className="text-sm font-medium text-ink-2 mb-2">最近 7 天</h3>
        <div className="flex gap-1.5">
          {last7Days.map(date => {
            const record = progress.dailyRecords.find(r => r.date === date);
            const dayLabel = ['日', '一', '二', '三', '四', '五', '六'][new Date(date).getDay()];
            const count = record?.questionsAnswered ?? 0;
            const intensity = count >= 10 ? 'bg-success'
              : count >= 5 ? 'bg-success'
              : count > 0 ? 'bg-success-bg'
              : 'bg-paper-3';

            return (
              <div key={date} className="flex-1 text-center" title={`${date}: ${count} 题`}>
                <div className={`w-full aspect-square rounded ${intensity}`} />
                <div className="text-xs text-ink-3 mt-1">周{dayLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
