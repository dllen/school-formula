import React, { useMemo } from 'react';
import type { LearningProgress } from '../../hooks/useLearningProgress';
import { formatTime } from '../../utils/questionUtils';

interface ProgressDashboardProps {
  progress: LearningProgress;
  todayStats: { answered: number; correct: number; timeSpent: number };
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress, todayStats }) => {
  const overallAccuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      // eslint-disable-next-line react-hooks/purity
      const d = new Date(Date.now() - (6 - i) * 86400000);
      return d.toISOString().split('T')[0];
    });
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900">学习进度</h2>
        <p className="text-sm text-gray-500 mt-0.5">坚持每天练习，积少成多</p>
      </div>

      {/* Streak */}
      {progress.currentStreak > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-md p-3 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">🔥</span>
          <div>
            <div className="text-base font-semibold text-orange-700">
              连续学习 {progress.currentStreak} 天
            </div>
            <div className="text-xs text-orange-600">
              最长记录：{progress.longestStreak} 天
            </div>
          </div>
        </div>
      )}

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-md p-3 text-center ring-1 ring-gray-100">
          <div className="text-xl font-bold text-gray-900">{todayStats.answered}</div>
          <div className="text-xs text-gray-500 mt-0.5">今日答题</div>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center ring-1 ring-gray-100">
          <div className="text-xl font-bold text-green-700">{todayStats.correct}</div>
          <div className="text-xs text-gray-500 mt-0.5">今日正确</div>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center ring-1 ring-gray-100">
          <div className="text-xl font-bold text-gray-900">{formatTime(todayStats.timeSpent)}</div>
          <div className="text-xs text-gray-500 mt-0.5">今日用时</div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{progress.totalAnswered}</div>
          <div className="text-xs text-gray-500">累计答题</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{overallAccuracy}%</div>
          <div className="text-xs text-gray-500">总正确率</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{formatTime(progress.totalTimeSpent)}</div>
          <div className="text-xs text-gray-500">累计用时</div>
        </div>
      </div>

      {/* 7-Day Activity */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">最近 7 天</h3>
        <div className="flex gap-1.5">
          {last7Days.map(date => {
            const record = progress.dailyRecords.find(r => r.date === date);
            const dayLabel = ['日', '一', '二', '三', '四', '五', '六'][new Date(date).getDay()];
            const count = record?.questionsAnswered ?? 0;
            const intensity = count >= 10 ? 'bg-green-600'
              : count >= 5 ? 'bg-green-400'
              : count > 0 ? 'bg-green-200'
              : 'bg-gray-100';

            return (
              <div key={date} className="flex-1 text-center" title={`${date}: ${count} 题`}>
                <div className={`w-full aspect-square rounded ${intensity}`} />
                <div className="text-xs text-gray-400 mt-1">周{dayLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
