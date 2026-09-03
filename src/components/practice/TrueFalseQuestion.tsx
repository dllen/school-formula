import React, { useState } from 'react';
import type { Question } from '../../data/questions/types';

interface TrueFalseQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, onSubmit, disabled }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected !== null) {
      onSubmit(selected);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-900 leading-relaxed">{question.stem}</p>
      <div className="flex gap-4">
        <button
          onClick={() => setSelected('true')}
          disabled={disabled}
          className={`flex-1 p-6 rounded-xl border-2 transition-all text-center ${
            selected === 'true'
              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
          } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <span className="text-4xl block mb-2">✓</span>
          <span className="font-bold text-gray-900">正确</span>
        </button>
        <button
          onClick={() => setSelected('false')}
          disabled={disabled}
          className={`flex-1 p-6 rounded-xl border-2 transition-all text-center ${
            selected === 'false'
              ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
              : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
          } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <span className="text-4xl block mb-2">✗</span>
          <span className="font-bold text-gray-900">错误</span>
        </button>
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
