import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePracticeSession } from './practice/usePracticeSession';
import { TopicPicker } from './practice/TopicPicker';
import { QuestionCard } from './practice/QuestionCard';
import { ExplanationPanel } from './practice/ExplanationPanel';
import { PracticeProgress } from './practice/PracticeProgress';
import { PracticeResult } from './practice/PracticeResult';
import { ErrorBookButton } from './practice/ErrorBookButton';
import { getQuestionById, getQuestionsByKnowledgePoint } from '../data/questions';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { useErrorBook } from '../hooks/useErrorBook';
import { useLearningProgress } from '../hooks/useLearningProgress';
import { useTopicMastery } from '../hooks/useTopicMastery';
import { ProgressDashboard } from './practice/ProgressDashboard';
import { checkAnswer } from '../utils/questionUtils';
import type { GradeLevel } from '../data/knowledge';

const QUESTIONS_PER_TOPIC = 20;

interface StartPanelProps {
  topicId: string;
  onStart: () => void;
  onBack: () => void;
}

/** 专题详情 + 开始按钮 */
const StartPanel: React.FC<StartPanelProps> = ({ topicId, onStart, onBack }) => {
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const kp = useMemo(() => {
    for (const grade of KNOWLEDGE_DATA) {
      for (const subject of grade.subjects) {
        const found = subject.knowledgePoints.find((k) => k.id === topicId);
        if (found) return { ...found, subjectName: subject.name, icon: subject.icon ?? '📚' };
      }
    }
    return null;
  }, [topicId]);

  const count = getQuestionsByKnowledgePoint(topicId).length;

  if (!kp) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F1F2] p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <span className="text-3xl">{kp.icon}</span>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-[#1F2329]">{kp.title}</h2>
          <p className="text-sm text-[#646A73] mt-0.5">{kp.subjectName} · {count} 道题</p>
          {kp.description && (
            <p className="text-sm text-[#8F959E] mt-2">{kp.description}</p>
          )}
        </div>
      </div>
      <p className="text-sm text-[#646A73] mb-5">
        每次随机抽取 {Math.min(QUESTIONS_PER_TOPIC, count)} 题，完成后记录专题掌握度。
      </p>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-[#1F2329] bg-[#F5F6F7] rounded-lg hover:bg-gray-200 btn-press"
        >
          返回专题列表
        </button>
        <button
          onClick={onStart}
          className="px-5 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 btn-press"
        >
          开始练习
        </button>
      </div>
    </div>
  );
};

export const PracticeView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('primary');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const startPanelRef = useRef<HTMLDivElement>(null);

  const session = usePracticeSession();
  const errorBook = useErrorBook();
  const learningProgress = useLearningProgress();
  const topicMastery = useTopicMastery();
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const hasRecordedProgress = useRef(false);

  // Auto-pick topic from URL (?kp=xxx)
  useEffect(() => {
    const kp = searchParams.get('kp');
    if (kp && getQuestionsByKnowledgePoint(kp).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTopicId(kp);
    }
  }, [searchParams]);

  // Record learning progress when finishing (not during render!)
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

  // Scroll the StartPanel into view once it appears (grid can be very long)
  useEffect(() => {
    if (selectedTopicId && startPanelRef.current) {
      startPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedTopicId]);

  const handlePickTopic = useCallback((kpId: string) => {
    setSelectedTopicId(kpId);
  }, []);

  const handleStart = useCallback(() => {
    if (!selectedTopicId) return;
    const all = getQuestionsByKnowledgePoint(selectedTopicId);
    // 随机抽 20 题（上限不超过该专题总题量）
    const questions = [...all].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_TOPIC);
    hasRecordedProgress.current = false;
    session.startPractice(questions);
  }, [selectedTopicId, session]);

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
      setSelectedTopicId(null);
    }
  }, [session]);

  const confirmExit = useCallback(() => {
    setShowExitConfirm(false);
    session.resetToFilter();
    setSelectedTopicId(null);
  }, [session]);

  const handleBackToTopics = useCallback(() => {
    session.resetToFilter();
    setSelectedTopicId(null);
  }, [session]);

  const handleTopicResult = useCallback(
    (topicId: string, correct: number, total: number) => {
      topicMastery.recordTopicAttempt(topicId, correct, total);
    },
    [topicMastery],
  );

  // Calculate total time when session is finished
  const totalTime = useMemo(() => {
    if (session.phase === 'finished' && session.stats) {
      // eslint-disable-next-line react-hooks/purity
      return Math.round((Date.now() - session.startTime) / 1000);
    }
    return 0;
  }, [session.phase, session.stats, session.startTime]);

  // --- 专题选择阶段 ---
  if (!selectedTopicId || session.phase === 'filtering') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <TopicPicker
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
          masteryById={topicMastery.masteryById}
          masteryPercent={topicMastery.masteryPercent}
          onPickTopic={handlePickTopic}
        />
        {selectedTopicId && (
          <div ref={startPanelRef} className="max-w-3xl mx-auto space-y-6">
            <StartPanel
              topicId={selectedTopicId}
              onStart={handleStart}
              onBack={handleBackToTopics}
            />
            <ProgressDashboard
              progress={learningProgress.progress}
              todayStats={learningProgress.getTodayStats()}
            />
          </div>
        )}
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
              <h2 className="text-base font-semibold text-[#1F2329] mb-2">退出练习？</h2>
              <p className="text-sm text-[#646A73] mb-5">当前练习进度将不会保存</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-[#1F2329] bg-[#F5F6F7] rounded-md hover:bg-gray-200 btn-press"
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
          onBack={handleBackToTopics}
          topicId={selectedTopicId}
          onTopicResult={handleTopicResult}
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
