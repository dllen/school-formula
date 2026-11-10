import React, { useState, useEffect, useRef } from 'react';
import { getQuestionById } from '../../data/questions';
import { Icon } from '../icons/Icon';

interface ErrorBookProps {
  errors: Array<{
    questionId: string;
    userAnswer: string;
    wrongCount: number;
    lastWrongAt: number;
  }>;
  onClose: () => void;
  onPracticeError: (questionId: string) => void;
}

export const ErrorBook: React.FC<ErrorBookProps> = ({ errors, onClose, onPracticeError }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap focus within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sortedErrors = [...errors].sort((a, b) => b.lastWrongAt - a.lastWrongAt);

  return (
    <div
      className="bg-white rounded-lg border border-rule p-6 space-y-5 max-h-[85vh] flex flex-col"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="错题本"
    >
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-semibold text-ink">错题本</h2>
          <p className="text-sm text-ink-3 mt-0.5">共 {errors.length} 道错题，定期复习巩固</p>
        </div>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-md text-ink-3 hover:text-ink-2 hover:bg-paper-3 transition-colors"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>

      {errors.length === 0 ? (
        <div className="text-center py-10 text-ink-3">
          <Icon name="trophy" className="w-10 h-10 mb-2 text-success" />
          <p className="text-sm">暂无错题，继续保持！</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1">
          {sortedErrors.map(err => {
            const question = getQuestionById(err.questionId);
            if (!question) return null;
            const isExpanded = selectedId === err.questionId;

            return (
              <div
                key={err.questionId}
                className="border border-rule rounded-md overflow-hidden"
              >
                <button
                  onClick={() => setSelectedId(isExpanded ? null : err.questionId)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-3 hover:bg-paper-2 flex items-start gap-3 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-error-bg text-error flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                    {err.wrongCount}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink font-medium truncate">{question.stem}</p>
                    <div className="flex gap-2 mt-1 text-xs text-ink-3">
                      <span>{new Date(err.lastWrongAt).toLocaleDateString()}</span>
                      <span className="px-1.5 py-0.5 bg-paper-3 rounded text-ink-3">{question.tags[0]}</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-paper-3 p-3 bg-paper-2 space-y-2">
                    <div className="text-sm">
                      <span className="text-ink-3">你的答案：</span>
                      <span className="text-error ml-1">{err.userAnswer || '（未作答）'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-ink-3">正确答案：</span>
                      <span className="text-success ml-1">{question.answer}</span>
                    </div>
                    <div className="bg-accent-soft border border-accent-soft rounded p-2.5">
                      <span className="text-xs font-medium text-accent-active">解析：</span>
                      <p className="text-xs text-accent-hover mt-0.5">{question.explanation}</p>
                    </div>
                    <button
                      onClick={() => onPracticeError(err.questionId)}
                      className="px-3 py-1.5 bg-ink text-white text-xs rounded-md font-medium hover:bg-ink btn-press"
                    >
                      单独练习此题
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
