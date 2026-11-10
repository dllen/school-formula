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
  basic: 'bg-success-bg text-success-ink ring-1 ring-success-bg',
  intermediate: 'bg-warning-bg text-warning-ink ring-1 ring-warning-bg',
  advanced: 'bg-error-bg text-error-ink ring-1 ring-error-bg',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSubmit, disabled }) => {
  return (
    <div className="bg-white rounded-lg border border-rule p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${DIFFICULTY_STYLES[question.difficulty]}`}>
          {getDifficultyLabel(question.difficulty)}
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-paper-2 text-ink-2 ring-1 ring-rule">
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
