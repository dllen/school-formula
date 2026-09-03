import React, { useState } from 'react';
import type { Question } from '../../data/questions/types';

interface FillBlankQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-900 leading-relaxed">{question.stem}</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">你的答案</label>
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="请输入答案..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg disabled:opacity-60"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!answer.trim() || disabled}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        提交答案
      </button>
    </div>
  );
};
