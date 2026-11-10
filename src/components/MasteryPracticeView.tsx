import { useState, useEffect, useCallback, useRef } from 'react';
import type { Technique, Question } from '../data/mastery/types';
import { generateQuestions } from '../data/mastery/qgen';
import { recordAttempt } from '../data/mastery/progress';
import { Icon } from './icons/Icon';

interface Props {
  technique: Technique | null;
  onBack: () => void;
}

export const MasteryPracticeView: React.FC<Props> = ({ technique, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>(() =>
    technique ? generateQuestions(technique.id, 6) : []
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timedMode, setTimedMode] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 计时器
  useEffect(() => {
    if (timedMode && !finished && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [timedMode, finished, questions.length]);

  // 完成时停止计时
  useEffect(() => {
    if (finished && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [finished]);

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null || !questions[currentIdx]) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === questions[currentIdx].ans;
    if (correct) setCorrectCount(prev => prev + 1);
    if (technique) {
      recordAttempt(technique.id, correct, questions[currentIdx].point);
    }
  }, [selected, questions, currentIdx, technique]);

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    if (!technique) return;
    setQuestions(generateQuestions(technique.id, 6));
    setCurrentIdx(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
    setShowExplanation(false);
    setElapsed(0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!technique) {
    return (
      <div className="empty-state">
        <Icon name="route" className="h-8 w-8" />
        <p className="text-body-s text-ink-2">请从学习路径或方法库中选择一个方法开始练习</p>
        <button type="button" onClick={onBack} className="btn btn-secondary">
          <Icon name="arrow-left" className="h-4 w-4" />
          返回学习路径
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="hourglass" className="h-8 w-8" />
        <p className="text-body-s text-ink-2">该方法的出题引擎尚未就绪，敬请期待</p>
      </div>
    );
  }

  if (finished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const avgTime = Math.round(elapsed / questions.length);

    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          {accuracy >= 80 ? (
            <Icon name="trophy" className="h-8 w-8 text-success" />
          ) : accuracy >= 60 ? (
            <Icon name="check-circle" className="h-8 w-8 text-accent" />
          ) : (
            <Icon name="flame" className="h-8 w-8 text-warning" />
          )}
          <h2 className="text-section font-semibold text-ink">练习完成</h2>
        </div>

        <dl className="mt-6 divide-y divide-divider border-y border-rule">
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-body-s text-ink-2">正确率</dt>
            <dd className="tabular text-title font-semibold text-ink">
              {correctCount}/{questions.length}（{accuracy}%）
            </dd>
          </div>
          {timedMode && (
            <>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-body-s text-ink-2">总用时</dt>
                <dd className="tabular text-title font-semibold text-ink">{formatTime(elapsed)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-body-s text-ink-2">平均每题</dt>
                <dd className="tabular text-title font-semibold text-ink">{avgTime}s</dd>
              </div>
            </>
          )}
        </dl>

        <p className="mt-6 text-body-s text-ink-2">
          {accuracy >= 80 ? '恭喜通关！可以继续下一个方法了。' : '继续加油，多练习几次就能通关！'}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={onBack} className="btn btn-secondary">
            返回路径
          </button>
          <button type="button" onClick={handleRestart} className="btn btn-primary">
            再练一组
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIdx];
  const isAnswered = selected !== null;
  const isRight = selected === current.ans;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" onClick={onBack} className="btn btn-ghost tap-44 -ml-2">
            <Icon name="arrow-left" className="h-4 w-4" />
            返回
          </button>
          <span className="truncate text-subhead font-semibold text-ink">{technique.name}</span>
        </div>
        <div className="flex items-center gap-4 text-label text-ink-3">
          {timedMode && (
            <span className="flex items-center gap-1.5 text-warning-ink">
              <Icon name="clock" className="h-4 w-4" />
              <span className="tabular font-mono">{formatTime(elapsed)}</span>
            </span>
          )}
          <span className="tabular">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <label className="tap-44 inline-flex items-center gap-2 text-body-s text-ink-2">
          <input
            type="checkbox"
            checked={timedMode}
            onChange={e => setTimedMode(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          <span className="flex items-center gap-1.5">
            <Icon name="clock" className="h-4 w-4 text-ink-3" />
            计时挑战模式
          </span>
        </label>
      </div>

      <div className="well mt-4">
        <div className="flex flex-wrap items-center gap-4 text-caption text-ink-3">
          <span className="tabular">第 {currentIdx + 1} 题</span>
          <span className="flex items-center gap-1">
            难度
            {[...Array(current.level)].map((_, i) => (
              <Icon key={i} name="star" className="h-3.5 w-3.5" />
            ))}
          </span>
        </div>

        <p className="mt-2 whitespace-pre-line text-body font-medium text-ink">{current.q}</p>

        <div className="mt-3 divide-y divide-rule">
          {current.opts.map((opt, idx) => {
            const state = !isAnswered
              ? 'border-l-transparent text-ink hover:bg-paper-3'
              : idx === current.ans
                ? 'border-l-success bg-success-bg text-ink'
                : idx === selected
                  ? 'border-l-error bg-error-bg text-ink'
                  : 'border-l-transparent text-ink-3';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`tap-44 flex w-full items-start gap-3 border-l-2 px-2 py-2.5 text-left text-body-s transition-colors disabled:cursor-default ${state}`}
              >
                <span className="tabular font-medium text-ink-3">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="min-w-0 flex-1">{opt}</span>
                {isAnswered && idx === current.ans && (
                  <Icon name="check-circle" className="h-4 w-4 shrink-0 text-success" />
                )}
                {isAnswered && idx === selected && idx !== current.ans && (
                  <Icon name="cross" className="h-4 w-4 shrink-0 text-error" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <section className="mt-6 border-t border-divider pt-4">
          <div className="flex items-center gap-2">
            <Icon
              name={isRight ? 'check-circle' : 'cross'}
              className={`h-5 w-5 ${isRight ? 'text-success' : 'text-error'}`}
            />
            <h2 className="text-subhead font-semibold text-ink">
              {isRight ? '回答正确' : '回答错误'}
            </h2>
          </div>

          <div className="mt-2">
            <p className="flex items-center gap-1.5 text-label font-semibold text-ink-2">
              <Icon name="clipboard" className="h-4 w-4" />
              解析
            </p>
            <p className="mt-1 whitespace-pre-line text-body-s text-ink-2">{current.explain}</p>
          </div>

          <p className="mt-3 text-caption text-ink-3">
            <span className="font-medium text-ink-2">得分点</span> {current.point}
          </p>
        </section>
      )}

      {showExplanation && (
        <button type="button" onClick={handleNext} className="btn btn-primary btn-lg mt-6 w-full">
          {currentIdx + 1 >= questions.length ? '查看结果' : '下一题'}
        </button>
      )}
    </div>
  );
};
