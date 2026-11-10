import { useState, useEffect } from 'react';
import { loadProgress, getWeakTechniques, getReviewTechniques, getWeeklyActivity } from '../data/mastery/progress';
import { TECHNIQUES } from '../data/mastery/techniques';
import type { MasteryProgress } from '../data/mastery/types';
import { Icon } from './icons/Icon';

export const MasteryProgressView: React.FC<{ onGoPath?: () => void }> = ({ onGoPath }) => {
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

  const isEmpty = totalMastered === 0 && totalAttempts === 0;

  return (
    <div>
      {isEmpty ? (
        <div className="empty-state">
          <Icon name="route" className="h-6 w-6" />
          <p className="text-body-s">还没有练习记录，快去学习路径开始第一个方法吧！</p>
          {onGoPath && (
            <button type="button" className="btn btn-primary" onClick={onGoPath}>
              返回学习路径
            </button>
          )}
        </div>
      ) : (
        <>
      {/* 总览：一行行读数，用分线隔开，不做盒子 */}
      <section className="section" aria-labelledby="mastery-overview">
        <h2 id="mastery-overview" className="section-head">
          掌握度总览
        </h2>
        <dl className="mt-4 divide-y divide-divider border-y border-rule">
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-body-s text-ink-2">已通关方法</dt>
            <dd className="tabular text-title font-semibold text-ink">
              {totalMastered} / {totalTechniques}
              <span className="ml-3 text-caption font-normal text-ink-3">{pct}%</span>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-body-s text-ink-2">总练习</dt>
            <dd className="tabular text-title font-semibold text-ink">{totalAttempts} 题</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-body-s text-ink-2">正确率</dt>
            <dd className="tabular text-title font-semibold text-ink">{overallAccuracy}%</dd>
          </div>
        </dl>
      </section>

      {/* 7 天趋势 */}
      <section className="section" aria-labelledby="mastery-trend">
        <h2 id="mastery-trend" className="section-head">
          <Icon name="chart" className="h-5 w-5" />
          近 7 天练习趋势
        </h2>
        <div className="mt-4">
          <div className="flex gap-2">
            {weekly.map((day, i) => (
              <span key={i} className="tabular flex-1 text-center text-caption text-ink-3">
                {day.attempts > 0 ? day.attempts : ''}
              </span>
            ))}
          </div>
          <div className="mt-1 flex h-24 items-end gap-2 border-b border-divider">
            {weekly.map((day, i) => {
              const height = day.attempts > 0 ? Math.max((day.attempts / maxAttempts) * 100, 8) : 0;
              const isToday = i === weekly.length - 1;
              return (
                <div key={i} className="flex h-full flex-1 items-end">
                  {day.attempts > 0 && (
                    <div
                      className={`w-full rounded-t-sm ${isToday ? 'bg-accent' : 'bg-accent-soft-hover'}`}
                      style={{ height: `${height}%` }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex gap-2">
            {weekly.map((day, i) => (
              <span
                key={i}
                className={`flex-1 text-center text-caption ${
                  i === weekly.length - 1 ? 'font-medium text-accent' : 'text-ink-3'
                }`}
              >
                {day.date}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 薄弱方法 */}
      {weak.length > 0 && (
        <section className="section" aria-labelledby="mastery-weak">
          <h2 id="mastery-weak" className="section-head">
            <Icon name="shield" className="h-5 w-5" />
            薄弱方法（正确率 &lt; 60%）
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {weak.map(id => {
              const t = TECHNIQUES.find(x => x.id === id);
              return t ? (
                <li key={id}>
                  <span className="tag text-error-ink">{t.name}</span>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}

      {/* 需要复习 */}
      {review.length > 0 && (
        <section className="section" aria-labelledby="mastery-review">
          <h2 id="mastery-review" className="section-head">
            <Icon name="route" className="h-5 w-5" />
            需要复习（3天未练习）
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {review.map(id => {
              const t = TECHNIQUES.find(x => x.id === id);
              return t ? (
                <li key={id}>
                  <span className="tag text-warning-ink">{t.name}</span>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}

        </>
      )}
    </div>
  );
};
