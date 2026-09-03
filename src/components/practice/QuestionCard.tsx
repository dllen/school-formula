import React from 'react';
import type { Question } from '../../data/questions/types';
import { ChoiceQuestion } from './ChoiceQuestion';
import { FillBlankQuestion } from './FillBlankQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';

interface QuestionCardProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  basic: { label: '基础', color: 'bg-green-100 text-green-700' },
  intermediate: { label: '提高', color: 'bg-amber-100 text-amber-700' },
  advanced: { label: '挑战', color: 'bg-red-100 text-red-700' },
};

const TYPE_CONFIG: Record<string, string> = {
  choice: '选择题',
  'fill-blank': '填空题',
  'true-false': '判断题',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSubmit, disabled }) => {
  const diffConfig = DIFFICULTY_CONFIG[question.difficulty];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${diffConfig.color}`}>
          {diffConfig.label}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
          {TYPE_CONFIG[question.type]}
        </span>
      </div>

      {question.type === 'choice' && (
        <ChoiceQuestion question={question} onSubmit={onSubmit} disabled={disabled} />
      )}
      {question.type === 'fill-blank' && (
        <FillBlankQuestion question={question} onSubmit={onSubmit} disabled={disabled} />
      )}
      {question.type === 'true-false' && (
        <TrueFalseQuestion question={question} onSubmit={onSubmit} disabled={disabled} />
      )}
    </div>
  );
};
