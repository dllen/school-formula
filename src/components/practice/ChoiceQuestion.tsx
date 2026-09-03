import React, { useState } from 'react';
import type { Question } from '../../data/questions/types';

interface ChoiceQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected !== null) {
      onSubmit(selected);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-900 leading-relaxed">{question.stem}</p>
      <div className="space-y-3">
        {question.options?.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return (
            <button
              key={idx}
              onClick={() => setSelected(letter)}
              disabled={disabled}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected === letter
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              <span className="font-medium text-gray-900">{option}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null || disabled}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        提交答案
      </button>
    </div>
  );
};
