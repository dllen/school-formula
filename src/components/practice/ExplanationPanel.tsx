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
    <div className="space-y-4">
      <div className={`p-4 rounded-md border ${
        answer.isCorrect
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`} role="alert" aria-live="polite">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-lg font-semibold ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {answer.isCorrect ? '回答正确' : '回答错误'}
          </span>
        </div>
        {!answer.isCorrect && (
          <p className="text-sm text-red-700 mt-1">
            你的答案：<span className="font-medium">{answer.userAnswer}</span>
            {' · '}
            正确答案：<span className="font-medium">{question.answer}</span>
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">解析</h3>
        <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">{question.explanation}</p>
      </div>

      {question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {question.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-2.5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors btn-press"
      >
        {isLast ? '查看结果' : '下一题'}
      </button>
    </div>
  );
};
