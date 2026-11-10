import React, { useState, useEffect } from 'react';
import type { LearningProgress } from '../../hooks/useLearningProgress';
import { formatTime } from '../../utils/questionUtils';
import { Icon } from '../icons/Icon';

interface ProgressDashboardProps {
  progress: LearningProgress;
  todayStats: { answered: number; correct: number; timeSpent: number };
}

/**
 * 学习进度是一块扁平的统计：数值用等宽数字对齐，行与行之间用细线分开，
 * 没有盒子、没有圆环，也没有第二层卡片。
 */
export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress, todayStats }) => {
  const overallAccuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  const isEmpty = progress.totalAnswered === 0 && todayStats.answered === 0;

  const [last7Days, setLast7Days] = useState<string[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe: render empty on server, populate after mount
    setLast7Days(Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400000);
      return d.toISOString().split('T')[0];
    }));
  }, []);

  return (
    <section className="mt-4 border-t border-divider pt-4 sm:mt-6 sm:pt-6">
      <h2 className="section-head">学习进度</h2>
      <p className="section-note">坚持每天练习，积少成多</p>

      {isEmpty ? (
        <p className="mt-4 max-w-prose text-body-s text-ink-2">
          还没有练习记录。选一个专题做完第一组题，这里会出现今日与累计统计。
        </p>
      ) : (
        <>
      {progress.currentStreak > 0 && (
        <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-4">
          <span className="flex items-center gap-1.5 text-body-s font-medium text-ink">
            <Icon name="flame" className="h-4 w-4 shrink-0 text-warning" />
            <span>
              连续学习 <span className="tabular">{progress.currentStreak}</span> 天
            </span>
          </span>
          <span className="text-caption text-ink-3">
            最长记录：<span className="tabular">{progress.longestStreak}</span> 天
          </span>
        </p>
      )}

      <dl className="mt-4 border-t border-divider sm:mt-6">
        <div className="grid grid-cols-3 divide-x divide-divider">
          <div className="py-2 pr-4 sm:py-3">
            <dt className="text-caption text-ink-3 whitespace-nowrap">今日答题</dt>
            <dd className="mt-0.5 text-subhead font-semibold tabular text-ink sm:mt-1">{todayStats.answered}</dd>
          </div>
          <div className="px-4 py-2 sm:py-3">
            <dt className="text-caption text-ink-3 whitespace-nowrap">今日正确</dt>
            <dd className="mt-0.5 text-subhead font-semibold tabular text-success-ink sm:mt-1">{todayStats.correct}</dd>
          </div>
          <div className="py-2 pl-4 sm:py-3">
            <dt className="text-caption text-ink-3 whitespace-nowrap">今日用时</dt>
            <dd className="mt-0.5 text-subhead font-semibold tabular text-ink sm:mt-1">{formatTime(todayStats.timeSpent)}</dd>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-divider border-t border-divider">
          <div className="py-2 pr-4 sm:py-3">
            <dt className="text-caption text-ink-3 whitespace-nowrap">累计答题</dt>
            <dd className="mt-0.5 text-subhead font-semibold tabular text-ink sm:mt-1">{progress.totalAnswered}</dd>
          </div>
          <div className="px-4 py-2 sm:py-3">
            <dt className="text-caption text-ink-3 whitespace-nowrap">总正确率</dt>
            <dd className="mt-0.5 text-subhead font-semibold tabular text-ink sm:mt-1">{overallAccuracy}%</dd>
          </div>
          <div className="py-2 pl-4 sm:py-3">
            <dt className="text-caption text-ink-3 whitespace-nowrap">累计用时</dt>
            <dd className="mt-0.5 text-subhead font-semibold tabular text-ink sm:mt-1">{formatTime(progress.totalTimeSpent)}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-4 border-t border-divider pt-3 sm:mt-6 sm:pt-4">
        <h3 className="text-label font-medium text-ink-2">最近 7 天</h3>
        <div className="mt-2 flex gap-1.5">
          {last7Days.map(date => {
            const record = progress.dailyRecords.find(r => r.date === date);
            const dayLabel = ['日', '一', '二', '三', '四', '五', '六'][new Date(date).getDay()];
            const count = record?.questionsAnswered ?? 0;
            const intensity = count >= 10 ? 'bg-success'
              : count >= 5 ? 'bg-success-mid'
              : count > 0 ? 'bg-success-bg'
              : 'bg-paper-3';

            return (
              <div key={date} className="flex-1 text-center" title={`${date}: ${count} 题`}>
                <div className="text-caption tabular text-ink-3">{count}</div>
                <div className={`mt-1 h-5 w-full rounded-sm sm:h-6 ${intensity}`} />
                <div className="mt-1 text-caption text-ink-3">周{dayLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </section>
  );
};
