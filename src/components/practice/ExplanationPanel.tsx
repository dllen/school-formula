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
          ? 'bg-success-bg border-success-bg'
          : 'bg-error-bg border-error-bg'
      }`} role="alert" aria-live="polite">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-lg font-semibold ${answer.isCorrect ? 'text-success-ink' : 'text-error-ink'}`}>
            {answer.isCorrect ? '回答正确' : '回答错误'}
          </span>
        </div>
        {!answer.isCorrect && (
          <p className="text-sm text-error-ink mt-1">
            你的答案：<span className="font-medium">{answer.userAnswer}</span>
            {' · '}
            正确答案：<span className="font-medium">{question.answer}</span>
          </p>
        )}
      </div>

      <div className="bg-accent-soft border border-accent-soft-hover rounded-md p-4">
        <h3 className="text-sm font-semibold text-accent-active mb-2">解析</h3>
        <p className="text-sm text-accent-active leading-relaxed whitespace-pre-line">{question.explanation}</p>
      </div>

      {question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {question.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-paper-3 text-ink-2 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-2.5 bg-ink text-white rounded-md font-medium hover:bg-ink transition-colors btn-press"
      >
        {isLast ? '查看结果' : '下一题'}
      </button>
    </div>
  );
};
