import React from 'react';

interface PracticeProgressProps {
  current: number;
  total: number;
  correctCount: number;
  wrongCount: number;
}

export const PracticeProgress: React.FC<PracticeProgressProps> = ({
  current,
  total,
  correctCount,
  wrongCount,
}) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          题目 {current + 1} / {total}
        </span>
        <div className="flex gap-3">
          <span className="text-green-600 font-medium">✓ {correctCount}</span>
          <span className="text-red-600 font-medium">✗ {wrongCount}</span>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
