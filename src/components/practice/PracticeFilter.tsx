import React from 'react';
import type { QuestionFilter, Difficulty, QuestionType } from '../../data/questions/types';
import { getAllTags } from '../../data/questions';

interface PracticeFilterProps {
  filter: QuestionFilter;
  onChange: (filter: QuestionFilter) => void;
  onStart: () => void;
  availableCount: number;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'basic', label: '基础' },
  { value: 'intermediate', label: '提高' },
  { value: 'advanced', label: '挑战' },
];

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'choice', label: '选择题' },
  { value: 'fill-blank', label: '填空题' },
  { value: 'true-false', label: '判断题' },
];

export const PracticeFilter: React.FC<PracticeFilterProps> = ({
  filter,
  onChange,
  onStart,
  availableCount,
}) => {
  const allTags = getAllTags();

  const toggleTag = (tag: string) => {
    const current = filter.tags || [];
    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onChange({ ...filter, tags: next });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">选择练习范围</h2>
        <p className="text-sm text-gray-500">选择知识点标签、难度和题型开始练习</p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-gray-700 mb-2">知识点标签</legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="知识点标签筛选">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              aria-pressed={filter.tags?.includes(tag) ?? false}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors btn-press ${
                filter.tags?.includes(tag)
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-gray-700 mb-2">难度</legend>
        <div className="flex gap-2" role="group" aria-label="难度筛选">
          {DIFFICULTY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filter, difficulty: filter.difficulty === opt.value ? undefined : opt.value })}
              aria-pressed={filter.difficulty === opt.value}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors btn-press ${
                filter.difficulty === opt.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-gray-700 mb-2">题型</legend>
        <div className="flex gap-2" role="group" aria-label="题型筛选">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filter, type: filter.type === opt.value ? undefined : opt.value })}
              aria-pressed={filter.type === opt.value}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors btn-press ${
                filter.type === opt.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          匹配题目：<span className="font-semibold text-gray-900">{availableCount}</span> 道
        </span>
        <button
          onClick={onStart}
          disabled={availableCount === 0}
          className="px-5 py-2.5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed btn-press"
        >
          开始练习
        </button>
      </div>
    </div>
  );
};
