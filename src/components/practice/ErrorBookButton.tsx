import React, { useState } from 'react';
import { ErrorBook } from './ErrorBook';

interface ErrorBookButtonProps {
  errors: Array<{
    questionId: string;
    userAnswer: string;
    wrongCount: number;
    lastWrongAt: number;
  }>;
  onPracticeError: (questionId: string) => void;
}

export const ErrorBookButton: React.FC<ErrorBookButtonProps> = ({ errors, onPracticeError }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative px-4 py-2 bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
      >
        <span>📕</span>
        <span>错题本</span>
        {errors.length > 0 && (
          <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {errors.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <ErrorBook
              errors={errors}
              onClose={() => setIsOpen(false)}
              onPracticeError={(id) => {
                setIsOpen(false);
                onPracticeError(id);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
