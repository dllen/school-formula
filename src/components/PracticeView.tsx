import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePracticeSession } from './practice/usePracticeSession';
import { PracticeFilter } from './practice/PracticeFilter';
import { QuestionCard } from './practice/QuestionCard';
import { ExplanationPanel } from './practice/ExplanationPanel';
import { PracticeProgress } from './practice/PracticeProgress';
import { PracticeResult } from './practice/PracticeResult';
import { ErrorBookButton } from './practice/ErrorBookButton';
import { filterQuestions, getRandomQuestions, getQuestionById } from '../data/questions';
import { useErrorBook } from '../hooks/useErrorBook';
import { useLearningProgress } from '../hooks/useLearningProgress';
import { ProgressDashboard } from './practice/ProgressDashboard';
import { checkAnswer } from '../utils/questionUtils';
import type { QuestionFilter } from '../data/questions/types';

const FILTER_STORAGE_KEY = 'practice-filter-selection';
const DEFAULT_FILTER: QuestionFilter = { grade: 'primary', subject: '数学' };

/** 从 localStorage 加载上次选择的筛选条件，无记录则返回默认值 */
function loadFilterFromStorage(): QuestionFilter {
  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as QuestionFilter;
      // 确保 grade 和 subject 都存在才使用（防止存储了不完整数据）
      if (saved.grade && saved.subject) {
        return saved;
      }
    }
  } catch {
    // 解析失败时忽略，使用默认值
  }
  return DEFAULT_FILTER;
}

/** 将当前筛选条件中的年级和科目保存到 localStorage */
function saveFilterToStorage(filter: QuestionFilter): void {
  try {
    const toSave = { grade: filter.grade, subject: filter.subject };
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // 存储失败时静默忽略（如隐私模式）
  }
}

export const PracticeView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<QuestionFilter>(() => loadFilterFromStorage());

  // 当用户更改年级或科目时，持久化到 localStorage
  useEffect(() => {
    saveFilterToStorage(filter);
  }, [filter]);

  const session = usePracticeSession();
  const errorBook = useErrorBook();
  const learningProgress = useLearningProgress();
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const hasRecordedProgress = useRef(false);

  // Auto-filter by knowledge point from URL (?kp=xxx)
  useEffect(() => {
    const kp = searchParams.get('kp');
    if (kp) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilter(prev => ({ ...prev, knowledgePointIds: [kp] }));
    }
  }, [searchParams]);

  const availableCount = useMemo(() => filterQuestions(filter).length, [filter]);

  // Record progress when finishing (not during render!)
  useEffect(() => {
    if (session.phase === 'finished' && session.stats && !hasRecordedProgress.current) {
      hasRecordedProgress.current = true;
      const totalTime = Math.round((Date.now() - session.startTime) / 1000);
      learningProgress.recordPractice(session.stats.total, session.stats.correct, totalTime);
    }
  }, [session.phase, session.stats, session.startTime, learningProgress]);

  // Warn before leaving during active practice
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (session.phase === 'answering') {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session.phase]);

  const handleStart = useCallback(() => {
    const questions = getRandomQuestions(filter, 10);
    hasRecordedProgress.current = false;
    session.startPractice(questions);
  }, [filter, session]);

  const handleSubmit = useCallback((answer: string) => {
    const currentQ = session.currentQuestion;
    session.submitAnswer(answer);
    if (currentQ) {
      const isCorrect = checkAnswer(answer, currentQ);
      if (!isCorrect) {
        errorBook.addError(currentQ.id, answer);
      } else {
        // Remove from error book if previously wrong
        errorBook.removeError(currentQ.id);
      }
    }
    setShowExplanation(true);
  }, [session, errorBook]);

  const handleNext = useCallback(() => {
    setShowExplanation(false);
    session.nextQuestion();
  }, [session]);

  const handlePrev = useCallback(() => {
    setShowExplanation(false);
    session.prevQuestion();
  }, [session]);

  const handleExit = useCallback(() => {
    if (session.phase === 'answering' && session.answeredCount > 0) {
      setShowExitConfirm(true);
    } else {
      session.resetToFilter();
    }
  }, [session]);

  const confirmExit = useCallback(() => {
    setShowExitConfirm(false);
    session.resetToFilter();
  }, [session]);

  // Calculate total time when session is finished
  const totalTime = useMemo(() => {
    if (session.phase === 'finished' && session.stats) {
      // eslint-disable-next-line react-hooks/purity
      return Math.round((Date.now() - session.startTime) / 1000);
    }
    return 0;
  }, [session.phase, session.stats, session.startTime]);

  if (session.phase === 'filtering') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">专题练习</h1>
          <p className="text-sm text-gray-500 mt-1">选择知识点和难度，开始针对性训练</p>
        </div>
        <PracticeFilter
          filter={filter}
          onChange={setFilter}
          onStart={handleStart}
          availableCount={availableCount}
        />
        <ProgressDashboard
          progress={learningProgress.progress}
          todayStats={learningProgress.getTodayStats()}
        />
      </div>
    );
  }

  if (session.phase === 'answering' && session.currentQuestion) {
    const correctCount = session.answers.filter(a => a.isCorrect).length;
    const wrongCount = session.answers.filter(a => !a.isCorrect).length;
    const isAnswered = session.hasAnsweredCurrent;

    return (
      <div className="space-y-5 max-w-3xl mx-auto">
        <PracticeProgress
          current={session.currentIndex}
          total={session.totalQuestions}
          correctCount={correctCount}
          wrongCount={wrongCount}
          answeredCount={session.answeredCount}
          onPrev={handlePrev}
          onNext={handleNext}
          onExit={handleExit}
          canGoBack={session.canGoBack}
          canGoNext={session.canGoNext && isAnswered}
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
            disabled={isAnswered}
          />
        )}

        {/* Exit confirmation modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="确认退出">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowExitConfirm(false)} />
            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-base font-semibold text-gray-900 mb-2">退出练习？</h2>
              <p className="text-sm text-gray-600 mb-5">当前练习进度将不会保存</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 btn-press"
                >
                  继续练习
                </button>
                <button
                  onClick={confirmExit}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 btn-press"
                >
                  确认退出
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (session.phase === 'finished' && session.stats) {
    return (
      <div className="space-y-5 max-w-3xl mx-auto">
        <PracticeResult
          questions={session.questions}
          answers={session.answers}
          totalTime={totalTime}
          onRetry={handleStart}
          onBack={session.resetToFilter}
        />
        <ProgressDashboard
          progress={learningProgress.progress}
          todayStats={learningProgress.getTodayStats()}
        />
        <div className="flex justify-center">
          <ErrorBookButton
            errors={errorBook.errors}
            onPracticeError={(questionId) => {
              const q = getQuestionById(questionId);
              if (q) {
                hasRecordedProgress.current = false;
                session.startPractice([q]);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return null;
};
