import React, { useState, useCallback } from 'react';
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

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative px-4 py-2 bg-red-50 text-red-700 rounded-md font-medium hover:bg-red-100 transition-colors flex items-center gap-2 btn-press"
        aria-label={`错题本，共 ${errors.length} 道错题`}
      >
        <span aria-hidden="true">📕</span>
        <span>错题本</span>
        {errors.length > 0 && (
          <span className="bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {errors.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
          <div className="relative w-full max-w-2xl">
            <ErrorBook
              errors={errors}
              onClose={handleClose}
              onPracticeError={(id) => {
                handleClose();
                onPracticeError(id);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
