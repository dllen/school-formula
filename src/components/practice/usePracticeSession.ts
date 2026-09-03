import { useState, useCallback, useRef } from 'react';
import type { Question, AnswerRecord } from '../../data/questions/types';

type PracticePhase = 'filtering' | 'answering' | 'reviewing' | 'finished';

interface PracticeState {
  phase: PracticePhase;
  questions: Question[];
  currentIndex: number;
  answers: AnswerRecord[];
  startTime: number;
}

export function usePracticeSession() {
  const [state, setState] = useState<PracticeState>({
    phase: 'filtering',
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,
  });

  const questionStartTime = useRef<number>(0);

  const startPractice = useCallback((questions: Question[]) => {
    setState({
      phase: 'answering',
      questions,
      currentIndex: 0,
      answers: [],
      startTime: Date.now(),
    });
    questionStartTime.current = Date.now();
  }, []);

  const submitAnswer = useCallback((userAnswer: string) => {
    setState(prev => {
      const currentQuestion = prev.questions[prev.currentIndex];
      const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000);

      let isCorrect = false;
      if (currentQuestion.type === 'choice') {
        isCorrect = userAnswer === currentQuestion.answer;
      } else if (currentQuestion.type === 'fill-blank') {
        isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
      } else if (currentQuestion.type === 'true-false') {
        isCorrect = userAnswer === currentQuestion.answer;
      }

      const newAnswers: AnswerRecord[] = [
        ...prev.answers,
        { questionId: currentQuestion.id, userAnswer, isCorrect, timeSpent },
      ];

      return { ...prev, answers: newAnswers };
    });
    questionStartTime.current = Date.now();
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex >= prev.questions.length - 1) {
        return { ...prev, phase: 'finished' };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const startReview = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'reviewing', currentIndex: 0 }));
  }, []);

  const resetToFilter = useCallback(() => {
    setState({
      phase: 'filtering',
      questions: [],
      currentIndex: 0,
      answers: [],
      startTime: 0,
    });
  }, []);

  const currentQuestion = state.phase === 'finished' ? null : state.questions[state.currentIndex] ?? null;

  const currentAnswer = state.phase === 'reviewing'
    ? state.answers[state.currentIndex]
    : state.answers[state.answers.length - 1];

  const stats = (() => {
    if (state.answers.length === 0) return null;
    const correct = state.answers.filter(a => a.isCorrect).length;
    const total = state.answers.length;
    const totalTime = state.answers.reduce((sum, a) => sum + a.timeSpent, 0);
    return {
      correct,
      total,
      accuracy: Math.round((correct / total) * 100),
      totalTime,
    };
  })();

  return {
    phase: state.phase,
    currentQuestion,
    currentAnswer,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    questions: state.questions,
    answers: state.answers,
    startTime: state.startTime,
    stats,
    startPractice,
    submitAnswer,
    nextQuestion,
    startReview,
    resetToFilter,
  };
}
