import React, { useState } from 'react';
import type { Question, AnswerRecord } from '../../data/questions/types';
import { formatTime, getDifficultyLabel } from '../../utils/questionUtils';

interface PracticeResultProps {
  questions: Question[];
  answers: AnswerRecord[];
  totalTime: number;
  onRetry: () => void;
  onBack: () => void;
}

type TabMode = 'wrong' | 'all';

export const PracticeResult: React.FC<PracticeResultProps> = ({
  questions,
  answers,
  totalTime,
  onRetry,
  onBack,
}) => {
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className={`text-4xl mb-2 ${accuracy >= 80 ? 'animate-celebrate' : ''}`}>
          {accuracy >= 80 ? '🎯' : accuracy >= 60 ? '👍' : '📝'}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">练习完成</h2>
        <p className="text-sm text-gray-500 mt-1">
          {accuracy >= 80 ? '表现优秀！' : accuracy >= 60 ? '继续加油！' : '多加练习！'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-md p-3 text-center ring-1 ring-gray-100">
          <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
          <div className="text-xs text-gray-500 mt-0.5">正确率</div>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center ring-1 ring-gray-100">
          <div className="text-2xl font-bold text-green-700">{correct}<span className="text-gray-400 text-lg">/{total}</span></div>
          <div className="text-xs text-gray-500 mt-0.5">正确数</div>
        </div>
        <div className="bg-gray-50 rounded-md p-3 text-center ring-1 ring-gray-100">
          <div className="text-2xl font-bold text-gray-900">{formatTime(totalTime)}</div>
          <div className="text-xs text-gray-500 mt-0.5">用时</div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">按难度统计</h3>
        <div className="space-y-2">
          {Object.entries(difficultyStats).map(([diff, stat]) => (
            <div key={diff} className="flex items-center gap-3">
              <span className="w-12 text-xs text-gray-500">{getDifficultyLabel(diff)}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-600 rounded-full progress-bar-fill"
                  style={{ width: `${stat.total > 0 ? (stat.correct / stat.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {stat.correct}/{stat.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-0.5 bg-gray-100 rounded-md" role="tablist">
        <button
          onClick={() => setTab('wrong')}
          role="tab"
          aria-selected={tab === 'wrong'}
          className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${
            tab === 'wrong' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          错题 ({wrongAnswers.length})
        </button>
        <button
          onClick={() => setTab('all')}
          role="tab"
          aria-selected={tab === 'all'}
          className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${
            tab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          全部 ({answers.length})
        </button>
      </div>

      {/* Answer List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {displayAnswers.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            {tab === 'wrong' ? '没有错题，全部正确！' : '暂无答题记录'}
          </div>
        ) : (
          displayAnswers.map((a, idx) => {
            const q = displayQuestions[idx];
            if (!q) return null;
            return (
              <div key={`${a.questionId}-${idx}`} className={`p-3 rounded-md border ${
                a.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
              }`}>
                <p className="text-sm text-gray-800 font-medium line-clamp-2">{q.stem}</p>
                <p className="text-xs mt-1">
                  <span className={a.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {a.isCorrect ? '✓ 正确' : '✗ 错误'}
                  </span>
                  {!a.isCorrect && (
                    <span className="text-gray-500 ml-2">
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
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors btn-press"
        >
          返回筛选
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-2.5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors btn-press"
        >
          再来一组
        </button>
      </div>
    </div>
  );
};
