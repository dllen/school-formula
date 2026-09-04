import React, { useState, useCallback } from 'react';
import type { Question } from '../../data/questions/types';

interface FillBlankQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = useCallback(() => {
    if (answer.trim()) {
      onSubmit(answer.trim());
    }
  }, [answer, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer.trim()) {
      handleSubmit();
    }
  }, [answer, handleSubmit]);

  return (
    <div className="space-y-4">
      <p className="text-base text-gray-900 leading-relaxed">{question.stem}</p>
      <div>
        <label htmlFor={`fill-answer-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
          你的答案
        </label>
        <input
          id={`fill-answer-${question.id}`}
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="请输入答案..."
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-colors text-base disabled:opacity-50 disabled:bg-gray-50"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!answer.trim() || disabled}
        className="w-full py-2.5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed btn-press"
      >
        提交答案
      </button>
    </div>
  );
};
