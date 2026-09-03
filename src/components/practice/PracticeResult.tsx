import React from 'react';
import type { Question, AnswerRecord } from '../../data/questions/types';

interface PracticeResultProps {
  questions: Question[];
  answers: AnswerRecord[];
  totalTime: number;
  onRetry: () => void;
  onBack: () => void;
}

export const PracticeResult: React.FC<PracticeResultProps> = ({
  questions,
  answers,
  totalTime,
  onRetry,
  onBack,
}) => {
  const correct = answers.filter(a => a.isCorrect).length;
  const total = answers.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins} 分 ${secs} 秒` : `${secs} 秒`;
  };

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

  const difficultyLabels: Record<string, string> = {
    basic: '基础',
    intermediate: '提高',
    advanced: '挑战',
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">练习完成！</h2>
        <p className="text-gray-500">
          {accuracy >= 80 ? '太棒了，继续保持！' : accuracy >= 60 ? '不错，还有提升空间！' : '加油，多练习就会进步！'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-indigo-50 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-indigo-700">{accuracy}%</div>
          <div className="text-sm text-indigo-600 mt-1">正确率</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{correct}/{total}</div>
          <div className="text-sm text-green-600 mt-1">正确数</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-700">{formatTime(totalTime)}</div>
          <div className="text-sm text-purple-600 mt-1">用时</div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-3">按难度统计</h3>
        <div className="space-y-2">
          {Object.entries(difficultyStats).map(([diff, stat]) => (
            <div key={diff} className="flex items-center gap-3">
              <span className="w-16 text-sm text-gray-600">{difficultyLabels[diff] || diff}</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${stat.total > 0 ? (stat.correct / stat.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-16 text-right">
                {stat.correct}/{stat.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {answers.some(a => !a.isCorrect) && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">错题回顾</h3>
          <div className="space-y-2">
            {answers.map((a, idx) => {
              if (a.isCorrect) return null;
              const q = questions[idx];
              return (
                <div key={a.questionId} className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm text-red-800 font-medium">{q.stem}</p>
                  <p className="text-xs text-red-600 mt-1">
                    你的答案：{a.userAnswer} | 正确答案：{q.answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          返回筛选
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          再来一组
        </button>
      </div>
    </div>
  );
};
