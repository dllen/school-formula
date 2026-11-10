import React, { useState, useEffect } from 'react';
import type { Question, AnswerRecord } from '../../data/questions/types';
import { formatTime, getDifficultyLabel } from '../../utils/questionUtils';
import { Icon } from '../icons/Icon';

interface PracticeResultProps {
  questions: Question[];
  answers: AnswerRecord[];
  totalTime: number;
  onRetry: () => void;
  onBack: () => void;
  /** 若传入，则在挂载时回写该专题的掌握度（总题数 / 正确数） */
  topicId?: string;
  onTopicResult?: (topicId: string, correct: number, total: number) => void;
}

type TabMode = 'wrong' | 'all';

export const PracticeResult: React.FC<PracticeResultProps> = ({
  questions,
  answers,
  totalTime,
  onRetry,
  onBack,
  topicId,
  onTopicResult,
}) => {
  useEffect(() => {
    if (topicId && onTopicResult) {
      const correct = answers.filter((a) => a.isCorrect).length;
      onTopicResult(topicId, correct, answers.length);
    }
    // 仅在挂载时回写一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [tab, setTab] = useState<TabMode>('wrong');
  const correct = answers.filter(a => a.isCorrect).length;
  const total = answers.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const difficultyStats = (() => {
    const map: Record<string, { correct: number; total: number }> = {};
    answers.forEach((a, idx) => {
      const diff = questions[idx].difficulty;
      if (!map[diff]) map[diff] = { correct: 0, total: 0 };
      map[diff].total++;
      if (a.isCorrect) map[diff].correct++;
    });
    return map;
  })();

  const wrongAnswers = answers.filter(a => !a.isCorrect);
  const displayAnswers = tab === 'wrong' ? wrongAnswers : answers;
  const displayQuestions = displayAnswers.map(a => questions.find(q => q.id === a.questionId)!);

  return (
    <div className="bg-white rounded-lg border border-rule p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className={`text-4xl mb-2 ${accuracy >= 80 ? 'animate-celebrate' : ''}`}>
          {accuracy >= 80 ? (
            <Icon name="target" className="w-12 h-12 text-success" />
          ) : accuracy >= 60 ? (
            <Icon name="check-circle" className="w-12 h-12 text-accent" />
          ) : (
            <Icon name="pencil" className="w-12 h-12 text-ink-3" />
          )}
        </div>
        <h2 className="text-lg font-semibold text-ink">练习完成</h2>
        <p className="text-sm text-ink-3 mt-1">
          {accuracy >= 80 ? '表现优秀！' : accuracy >= 60 ? '继续加油！' : '多加练习！'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-paper-2 rounded-md p-3 text-center ring-1 ring-paper-3">
          <div className="text-2xl font-bold text-ink">{accuracy}%</div>
          <div className="text-xs text-ink-3 mt-0.5">正确率</div>
        </div>
        <div className="bg-paper-2 rounded-md p-3 text-center ring-1 ring-paper-3">
          <div className="text-2xl font-bold text-success-ink">{correct}<span className="text-ink-3 text-lg">/{total}</span></div>
          <div className="text-xs text-ink-3 mt-0.5">正确数</div>
        </div>
        <div className="bg-paper-2 rounded-md p-3 text-center ring-1 ring-paper-3">
          <div className="text-2xl font-bold text-ink">{formatTime(totalTime)}</div>
          <div className="text-xs text-ink-3 mt-0.5">用时</div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div>
        <h3 className="text-sm font-medium text-ink-2 mb-2">按难度统计</h3>
        <div className="space-y-2">
          {Object.entries(difficultyStats).map(([diff, stat]) => (
            <div key={diff} className="flex items-center gap-3">
              <span className="w-12 text-xs text-ink-3">{getDifficultyLabel(diff)}</span>
              <div className="flex-1 h-2 bg-paper-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ink-2 rounded-full progress-bar-fill"
                  style={{ width: `${stat.total > 0 ? (stat.correct / stat.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-ink-3 w-12 text-right">
                {stat.correct}/{stat.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-0.5 bg-paper-3 rounded-md" role="tablist">
        <button
          onClick={() => setTab('wrong')}
          role="tab"
          aria-selected={tab === 'wrong'}
          className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${
            tab === 'wrong' ? 'bg-white text-ink shadow-sm' : 'text-ink-3 hover:text-ink-2'
          }`}
        >
          错题 ({wrongAnswers.length})
        </button>
        <button
          onClick={() => setTab('all')}
          role="tab"
          aria-selected={tab === 'all'}
          className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${
            tab === 'all' ? 'bg-white text-ink shadow-sm' : 'text-ink-3 hover:text-ink-2'
          }`}
        >
          全部 ({answers.length})
        </button>
      </div>

      {/* Answer List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {displayAnswers.length === 0 ? (
          <div className="text-center py-6 text-ink-3 text-sm">
            {tab === 'wrong' ? '没有错题，全部正确！' : '暂无答题记录'}
          </div>
        ) : (
          displayAnswers.map((a, idx) => {
            const q = displayQuestions[idx];
            if (!q) return null;
            return (
              <div key={`${a.questionId}-${idx}`} className={`p-3 rounded-md border ${
                a.isCorrect ? 'bg-success-bg border-success-bg' : 'bg-error-bg border-error-bg'
              }`}>
                <p className="text-sm text-ink font-medium line-clamp-2">{q.stem}</p>
                <p className="text-xs mt-1">
                  <span className={a.isCorrect ? 'text-success' : 'text-error'}>
                    {a.isCorrect ? '✓ 正确' : '✗ 错误'}
                  </span>
                  {!a.isCorrect && (
                    <span className="text-ink-3 ml-2">
                      你的答案：{a.userAnswer || '（未作答）'} · 正确：{q.answer}
                    </span>
                  )}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-paper-3">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 bg-paper-3 text-ink-2 rounded-md font-medium hover:bg-rule transition-colors btn-press"
        >
          返回筛选
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-2.5 bg-ink text-white rounded-md font-medium hover:bg-ink transition-colors btn-press"
        >
          再来一组
        </button>
      </div>
    </div>
  );
};
