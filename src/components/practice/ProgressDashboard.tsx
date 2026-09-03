import React from 'react';
import type { LearningProgress } from '../../hooks/useLearningProgress';

interface ProgressDashboardProps {
  progress: LearningProgress;
  todayStats: { answered: number; correct: number; timeSpent: number };
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress, todayStats }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} 分钟`;
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hours} 小时 ${remainMins} 分钟`;
  };

  const overallAccuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  // Get last 7 days for the activity heatmap
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">学习进度</h2>
        <p className="text-sm text-gray-500">坚持每天练习，积少成多</p>
      </div>

      {/* Streak Banner */}
      {progress.currentStreak > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4">
          <span className="text-4xl">🔥</span>
          <div>
            <div className="text-2xl font-bold text-orange-700">
              连续学习 {progress.currentStreak} 天
            </div>
            <div className="text-sm text-orange-600">
              最长记录：{progress.longestStreak} 天
            </div>
          </div>
        </div>
      )}

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-indigo-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-700">{todayStats.answered}</div>
          <div className="text-xs text-indigo-600 mt-1">今日答题</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{todayStats.correct}</div>
          <div className="text-xs text-green-600 mt-1">今日正确</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{formatTime(todayStats.timeSpent)}</div>
          <div className="text-xs text-purple-600 mt-1">今日用时</div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{progress.totalAnswered}</div>
          <div className="text-xs text-gray-500 mt-1">累计答题</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{overallAccuracy}%</div>
          <div className="text-xs text-gray-500 mt-1">总正确率</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{formatTime(progress.totalTimeSpent)}</div>
          <div className="text-xs text-gray-500 mt-1">累计用时</div>
        </div>
      </div>

      {/* 7-Day Activity */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">最近 7 天</h3>
        <div className="flex gap-2">
          {last7Days.map(date => {
            const record = progress.dailyRecords.find(r => r.date === date);
            const dayLabel = ['日', '一', '二', '三', '四', '五', '六'][new Date(date).getDay()];
            const intensity = record
              ? record.questionsAnswered >= 10 ? 'bg-green-500'
                : record.questionsAnswered >= 5 ? 'bg-green-300'
                : record.questionsAnswered > 0 ? 'bg-green-200'
                : 'bg-gray-100'
              : 'bg-gray-100';

            return (
              <div key={date} className="flex-1 text-center">
                <div className={`w-full aspect-square rounded-lg ${intensity} mb-1`} />
                <div className="text-xs text-gray-500">周{dayLabel}</div>
                {record && (
                  <div className="text-xs text-gray-400">{record.questionsAnswered}题</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
