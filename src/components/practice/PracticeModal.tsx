import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { usePracticeSession } from './usePracticeSession';
import { QuestionCard } from './QuestionCard';
import { ExplanationPanel } from './ExplanationPanel';
import { PracticeProgress } from './PracticeProgress';
import { PracticeResult } from './PracticeResult';
import { ErrorBookButton } from './ErrorBookButton';
import { getQuestionById, getQuestionsByKnowledgePoint } from '../../data/questions';
import { KNOWLEDGE_DATA } from '../../data/knowledge';
import { useErrorBook } from '../../hooks/useErrorBook';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import { useTopicMastery } from '../../hooks/useTopicMastery';
import { checkAnswer } from '../../utils/questionUtils';

const QUESTIONS_PER_TOPIC = 20;

interface PracticeModalProps {
  /** 知识点 ID；用于拉题、查 subject/title、记录掌握度 */
  topicId: string;
  isOpen: boolean;
  onClose: () => void;
}

/** 解析 topicId → { title, subjectName, icon, count } */
function resolveTopic(topicId: string) {
  for (const grade of KNOWLEDGE_DATA) {
    for (const subject of grade.subjects) {
      const found = subject.knowledgePoints.find((k) => k.id === topicId);
      if (found) {
        return {
          title: found.title,
          subjectName: subject.name,
          icon: subject.icon ?? '📚',
          count: getQuestionsByKnowledgePoint(topicId).length,
        };
      }
    }
  }
  return null;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({ topicId, isOpen, onClose }) => {
  // 会话与持久化 hooks（每次 mount 一份，避免跨专题残留）
  const session = usePracticeSession();
  const errorBook = useErrorBook();
  const learningProgress = useLearningProgress();
  const topicMastery = useTopicMastery();

  const [showExplanation, setShowExplanation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const hasRecordedProgress = useRef(false);
  // 防止 onClose 在已卸载组件上调用
  const mountedRef = useRef(true);

  const topic = useMemo(() => resolveTopic(topicId), [topicId]);

  // ---- 打开/关闭时的副作用 ----

  // 重置会话、焦点恢复、body 滚动锁
  useEffect(() => {
    mountedRef.current = true;
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    // 等 modal 渲染完再聚焦关闭按钮
    const id = requestAnimationFrame(() => closeButtonRef.current?.focus());
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = '';
      mountedRef.current = false;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen]);

  // beforeunload：正在答题时阻止离开页面
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (session.phase === 'answering') e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isOpen, session.phase]);

  // 完成时回写总学习进度
  useEffect(() => {
    if (session.phase === 'finished' && session.stats && !hasRecordedProgress.current) {
      hasRecordedProgress.current = true;
      const totalTime = Math.round((Date.now() - session.startTime) / 1000);
      learningProgress.recordPractice(session.stats.total, session.stats.correct, totalTime);
    }
    if (session.phase === 'filtering') hasRecordedProgress.current = false;
  }, [session.phase, session.stats, session.startTime, learningProgress]);

  // ---- 操作 ----

  const doClose = useCallback(() => {
    session.resetToFilter();
    setShowExplanation(false);
    setShowExitConfirm(false);
    onClose();
  }, [session, onClose]);

  const requestClose = useCallback(() => {
    if (session.phase === 'answering' && session.answeredCount > 0) {
      setShowExitConfirm(true);
    } else {
      doClose();
    }
  }, [doClose, session.phase, session.answeredCount]);

  const confirmExit = useCallback(() => {
    setShowExitConfirm(false);
    doClose();
  }, [doClose]);

  // ESC 关闭（含进度确认）
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, session.phase, session.answeredCount]);


  const handleStart = useCallback(() => {
    const all = getQuestionsByKnowledgePoint(topicId);
    if (all.length === 0) return;
    const questions = [...all].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_TOPIC);
    hasRecordedProgress.current = false;
    session.startPractice(questions);
    setShowExplanation(false);
  }, [topicId, session]);

  const handleSubmit = useCallback(
    (answer: string) => {
      const currentQ = session.currentQuestion;
      session.submitAnswer(answer);
      if (currentQ) {
        const isCorrect = checkAnswer(answer, currentQ);
        if (!isCorrect) errorBook.addError(currentQ.id, answer);
        else errorBook.removeError(currentQ.id);
      }
      setShowExplanation(true);
    },
    [session, errorBook],
  );

  const handleNext = useCallback(() => {
    setShowExplanation(false);
    session.nextQuestion();
  }, [session]);

  const handlePrev = useCallback(() => {
    setShowExplanation(false);
    session.prevQuestion();
  }, [session]);

  const handleTopicResult = useCallback(
    (id: string, correct: number, total: number) => {
      topicMastery.recordTopicAttempt(id, correct, total);
    },
    [topicMastery],
  );

  const totalTime = useMemo(() => {
    if (session.phase === 'finished' && session.stats) {
      // eslint-disable-next-line react-hooks/purity
      return Math.round((Date.now() - session.startTime) / 1000);
    }
    return 0;
  }, [session.phase, session.stats, session.startTime]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="practice-modal-title"
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={requestClose}
        aria-hidden="true"
      />

      {/* Modal 主体 */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header：专题信息 + 关闭 */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden="true">{topic?.icon ?? '📚'}</span>
            <div className="min-w-0">
              <h2
                id="practice-modal-title"
                className="font-bold text-gray-900 truncate"
              >
                {topic?.title ?? '专题练习'}
              </h2>
              {topic && (
                <p className="text-xs text-gray-500 truncate">
                  {topic.subjectName} · {topic.count} 道题
                </p>
              )}
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={requestClose}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none"
            aria-label="关闭练习"
          >
            ✕
          </button>
        </div>

        {/* Body：滚动容器 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* 阶段 1：专题介绍 + 开始 */}
          {session.phase === 'filtering' && topic && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-600 mb-5">
                每次随机抽取 {Math.min(QUESTIONS_PER_TOPIC, topic.count)} 题，完成后记录专题掌握度。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={doClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 btn-press"
                >
                  返回专题列表
                </button>
                <button
                  onClick={handleStart}
                  className="px-5 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 btn-press"
                >
                  开始练习
                </button>
              </div>
            </div>
          )}

          {/* 阶段 2：答题 */}
          {session.phase === 'answering' && session.currentQuestion && (
            <>
              <PracticeProgress
                current={session.currentIndex}
                total={session.totalQuestions}
                correctCount={session.answers.filter((a) => a.isCorrect).length}
                wrongCount={session.answers.filter((a) => !a.isCorrect).length}
                answeredCount={session.answeredCount}
                onPrev={handlePrev}
                onNext={handleNext}
                onExit={requestClose}
                canGoBack={session.canGoBack}
                canGoNext={session.canGoNext && session.hasAnsweredCurrent}
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
                  disabled={session.hasAnsweredCurrent}
                />
              )}
            </>
          )}

          {/* 阶段 3：结果 */}
          {session.phase === 'finished' && session.stats && (
            <>
              <PracticeResult
                questions={session.questions}
                answers={session.answers}
                totalTime={totalTime}
                onRetry={handleStart}
                onBack={doClose}
                topicId={topicId}
                onTopicResult={handleTopicResult}
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
            </>
          )}

          {/* 防御：topicId 解析失败 */}
          {!topic && (
            <div className="text-center py-10 text-gray-400 text-sm">
              未找到该专题，可能已被移除。
              <div className="mt-4">
                <button
                  onClick={doClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 btn-press"
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 退出确认（嵌套在 dialog 之上） */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowExitConfirm(false)}
            aria-hidden="true"
          />
          <div
            className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="exit-confirm-title"
          >
            <h2 id="exit-confirm-title" className="text-base font-semibold text-gray-900 mb-2">
              退出练习？
            </h2>
            <p className="text-sm text-gray-600 mb-5">当前练习进度将不会保存。</p>
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
};
