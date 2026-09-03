import React, { useState } from 'react';
import { getQuestionById } from '../../data/questions';

interface ErrorBookProps {
  errors: Array<{
    questionId: string;
    userAnswer: string;
    wrongCount: number;
    lastWrongAt: number;
  }>;
  onClose: () => void;
  onPracticeError: (questionId: string) => void;
}

export const ErrorBook: React.FC<ErrorBookProps> = ({ errors, onClose, onPracticeError }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sortedErrors = [...errors].sort((a, b) => b.lastWrongAt - a.lastWrongAt);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">错题本</h2>
          <p className="text-sm text-gray-500">共 {errors.length} 道错题，定期复习巩固</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      {errors.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-4">🎉</div>
          <p>暂无错题，继续保持！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedErrors.map(err => {
            const question = getQuestionById(err.questionId);
            if (!question) return null;
            const isExpanded = selectedId === err.questionId;

            return (
              <div
                key={err.questionId}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setSelectedId(isExpanded ? null : err.questionId)}
                  className="w-full text-left p-4 hover:bg-gray-50 flex items-start gap-3"
                >
                  <span className="text-red-500 mt-0.5">✗</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{question.stem}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span>错 {err.wrongCount} 次</span>
                      <span>{new Date(err.lastWrongAt).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{question.tags[0]}</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">你的答案：</span>
                      <span className="text-sm text-red-600 ml-2">{err.userAnswer || '（未作答）'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">正确答案：</span>
                      <span className="text-sm text-green-600 ml-2">{question.answer}</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">📖 解析：</span>
                      <p className="text-sm text-blue-700 mt-1">{question.explanation}</p>
                    </div>
                    <button
                      onClick={() => onPracticeError(err.questionId)}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium hover:bg-indigo-700"
                    >
                      单独练习此题
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
