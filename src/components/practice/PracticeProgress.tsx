import React from 'react';

interface PracticeProgressProps {
  current: number;
  total: number;
  correctCount: number;
  wrongCount: number;
  answeredCount: number;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
}

export const PracticeProgress: React.FC<PracticeProgressProps> = ({
  current,
  total,
  correctCount,
  wrongCount,
  answeredCount,
  onPrev,
  onNext,
  onExit,
  canGoBack,
  canGoNext,
}) => {
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onExit}
          className="text-sm text-ink-3 hover:text-ink-2 transition-colors"
          aria-label="退出练习"
        >
          ← 退出
        </button>
        <span className="text-sm font-medium text-ink-2">
          {current + 1} / {total}
        </span>
        <div className="flex gap-3 text-sm">
          <span className="text-success font-medium" aria-label={`正确 ${correctCount} 题`}>✓ {correctCount}</span>
          <span className="text-error font-medium" aria-label={`错误 ${wrongCount} 题`}>✗ {wrongCount}</span>
        </div>
      </div>

      <div
        className="h-1.5 bg-rule rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={answeredCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="练习进度"
      >
        <div
          className="h-full bg-ink-2 rounded-full progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={!canGoBack}
          className="px-3 py-1.5 text-sm text-ink-2 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← 上一题
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="px-3 py-1.5 text-sm text-ink-2 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          下一题
        </button>
      </div>
    </div>
  );
};
