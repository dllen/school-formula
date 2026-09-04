import React from 'react';
import type { Question } from '../../data/questions/types';
import { ChoiceQuestion } from './ChoiceQuestion';
import { FillBlankQuestion } from './FillBlankQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { getDifficultyLabel, getTypeLabel } from '../../utils/questionUtils';

interface QuestionCardProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  basic: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  intermediate: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  advanced: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSubmit, disabled }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${DIFFICULTY_STYLES[question.difficulty]}`}>
          {getDifficultyLabel(question.difficulty)}
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 ring-1 ring-gray-200">
          {getTypeLabel(question.type)}
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
