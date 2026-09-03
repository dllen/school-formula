import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'school_formula_error_book';

export interface ErrorEntry {
  questionId: string;
  userAnswer: string;
  wrongCount: number;
  lastWrongAt: number;
}

export function useErrorBook() {
  const [errors, setErrors] = useState<ErrorEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(errors));
  }, [errors]);

  const addError = useCallback((questionId: string, userAnswer: string) => {
    setErrors(prev => {
      const existing = prev.find(e => e.questionId === questionId);
      if (existing) {
        return prev.map(e =>
          e.questionId === questionId
            ? { ...e, userAnswer, wrongCount: e.wrongCount + 1, lastWrongAt: Date.now() }
            : e
        );
      }
      return [...prev, { questionId, userAnswer, wrongCount: 1, lastWrongAt: Date.now() }];
    });
  }, []);

  const removeError = useCallback((questionId: string) => {
    setErrors(prev => prev.filter(e => e.questionId !== questionId));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const isError = useCallback((questionId: string) => {
    return errors.some(e => e.questionId === questionId);
  }, [errors]);

  return { errors, addError, removeError, clearErrors, isError };
}
