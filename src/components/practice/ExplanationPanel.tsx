import React from 'react';
import type { Question, AnswerRecord } from '../../data/questions/types';

interface ExplanationPanelProps {
  question: Question;
  answer: AnswerRecord;
  onNext: () => void;
  isLast: boolean;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  question,
  answer,
  onNext,
  isLast,
}) => {
  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl border-2 ${
        answer.isCorrect
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{answer.isCorrect ? '✅' : '❌'}</span>
          <span className={`text-xl font-bold ${answer.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {answer.isCorrect ? '回答正确！' : '回答错误'}
          </span>
        </div>
        {!answer.isCorrect && (
          <p className="text-red-700 mt-2">
            你的答案：<span className="font-medium">{answer.userAnswer}</span>
            {' | '}
            正确答案：<span className="font-medium">{question.answer}</span>
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <span>📖</span> 解析
        </h4>
        <p className="text-blue-800 leading-relaxed whitespace-pre-line">{question.explanation}</p>
      </div>

      {question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {question.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        {isLast ? '查看结果' : '下一题 →'}
      </button>
    </div>
  );
};
