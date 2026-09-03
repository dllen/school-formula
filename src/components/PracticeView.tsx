import React, { useState, useMemo } from 'react';
import { usePracticeSession } from './practice/usePracticeSession';
import { PracticeFilter } from './practice/PracticeFilter';
import { QuestionCard } from './practice/QuestionCard';
import { ExplanationPanel } from './practice/ExplanationPanel';
import { PracticeProgress } from './practice/PracticeProgress';
import { PracticeResult } from './practice/PracticeResult';
import { ErrorBookButton } from './practice/ErrorBookButton';
import { filterQuestions, getRandomQuestions, getQuestionById } from '../data/questions';
import { useErrorBook } from '../hooks/useErrorBook';
import type { QuestionFilter } from '../data/questions/types';

export const PracticeView: React.FC = () => {
  const [filter, setFilter] = useState<QuestionFilter>({});
  const session = usePracticeSession();
  const errorBook = useErrorBook();

  const availableCount = useMemo(() => filterQuestions(filter).length, [filter]);

  const checkAnswer = (userAnswer: string, question: typeof session.currentQuestion): boolean => {
    if (!question) return false;
    if (question.type === 'choice') return userAnswer === question.answer;
    if (question.type === 'fill-blank') return userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    if (question.type === 'true-false') return userAnswer === question.answer;
    return false;
  };

  const handleStart = () => {
    const questions = getRandomQuestions(filter, 10);
    session.startPractice(questions);
  };

  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = (answer: string) => {
    const currentQ = session.currentQuestion;
    session.submitAnswer(answer);
    if (currentQ) {
      const isCorrect = checkAnswer(answer, currentQ);
      if (!isCorrect) {
        errorBook.addError(currentQ.id, answer);
      }
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    session.nextQuestion();
  };

  if (session.phase === 'filtering') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">专题练习</h2>
          <p className="text-sm text-gray-500">选择知识点和难度，开始针对性训练</p>
        </div>
        <PracticeFilter
          filter={filter}
          onChange={setFilter}
          onStart={handleStart}
          availableCount={availableCount}
        />
      </div>
    );
  }

  if (session.phase === 'answering' && session.currentQuestion) {
    const correctCount = session.answers.filter(a => a.isCorrect).length;
    const wrongCount = session.answers.filter(a => !a.isCorrect).length;

    return (
      <div className="space-y-6">
        <PracticeProgress
          current={session.currentIndex}
          total={session.totalQuestions}
          correctCount={correctCount}
          wrongCount={wrongCount}
        />
        {showExplanation && session.currentAnswer ? (
          <ExplanationPanel
            question={session.currentQuestion}
            answer={session.currentAnswer}
            onNext={handleNext}
            isLast={session.currentIndex >= session.totalQuestions - 1}
          />
        ) : (
          <QuestionCard
            question={session.currentQuestion}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    );
  }

  if (session.phase === 'finished' && session.stats) {
    const totalTime = Math.round((Date.now() - session.startTime) / 1000);
    return (
      <div className="space-y-6">
        <PracticeResult
          questions={session.questions}
          answers={session.answers}
          totalTime={totalTime}
          onRetry={handleStart}
          onBack={session.resetToFilter}
        />
        <div className="flex justify-center">
          <ErrorBookButton
            errors={errorBook.errors}
            onPracticeError={(questionId) => {
              const q = getQuestionById(questionId);
              if (q) session.startPractice([q]);
            }}
          />
        </div>
      </div>
    );
  }

  return null;
};
