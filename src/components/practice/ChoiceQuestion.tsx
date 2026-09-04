import React, { useState, useCallback } from 'react';
import type { Question } from '../../data/questions/types';

interface ChoiceQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    if (selected !== null) {
      onSubmit(selected);
    }
  }, [selected, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, letter: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelected(letter);
    }
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-base text-gray-900 leading-relaxed">{question.stem}</p>
      <div className="space-y-2" role="radiogroup" aria-label="选项">
        {question.options?.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selected === letter;
          return (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3.5 rounded-md border cursor-pointer transition-colors ${
                isSelected
                  ? 'border-gray-800 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={letter}
                checked={isSelected}
                onChange={() => setSelected(letter)}
                onKeyDown={(e) => handleKeyDown(e, letter)}
                disabled={disabled}
                className="sr-only"
                aria-label={`选项 ${letter}: ${option}`}
              />
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                isSelected ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {letter}
              </span>
              <span className="text-sm text-gray-800">{option}</span>
            </label>
          );
        })}
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
