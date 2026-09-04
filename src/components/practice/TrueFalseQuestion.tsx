import React, { useState, useCallback } from 'react';
import type { Question } from '../../data/questions/types';

interface TrueFalseQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    if (selected !== null) {
      onSubmit(selected);
    }
  }, [selected, onSubmit]);

  return (
    <div className="space-y-4">
      <p className="text-base text-gray-900 leading-relaxed">{question.stem}</p>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="判断正误">
        {[
          { value: 'true', label: '正确', color: 'border-green-300 bg-green-50 text-green-700', activeColor: 'border-green-600 bg-green-100 ring-2 ring-green-300' },
          { value: 'false', label: '错误', color: 'border-red-300 bg-red-50 text-red-700', activeColor: 'border-red-600 bg-red-100 ring-2 ring-red-300' },
        ].map(opt => (
          <label
            key={opt.value}
            className={`flex items-center justify-center gap-2 p-4 rounded-md border-2 cursor-pointer transition-colors ${
              selected === opt.value ? opt.activeColor : opt.color
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name={`tf-${question.id}`}
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
              disabled={disabled}
              className="sr-only"
              aria-label={opt.label}
            />
            <span className="text-lg">{opt.value === 'true' ? '✓' : '✕'}</span>
            <span className="font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null || disabled}
        className="w-full py-2.5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed btn-press"
      >
        提交答案
      </button>
    </div>
  );
};
