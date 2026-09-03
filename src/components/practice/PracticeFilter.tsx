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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">选择练习范围</h2>
        <p className="text-sm text-gray-500">选择知识点标签、难度和题型开始练习</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">知识点标签</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter.tags?.includes(tag)
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">难度</label>
        <div className="flex gap-2">
          {DIFFICULTY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filter, difficulty: filter.difficulty === opt.value ? undefined : opt.value })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter.difficulty === opt.value
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">题型</label>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filter, type: filter.type === opt.value ? undefined : opt.value })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter.type === opt.value
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          匹配题目：<span className="font-bold text-indigo-600">{availableCount}</span> 道
        </span>
        <button
          onClick={onStart}
          disabled={availableCount === 0}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          开始练习
        </button>
      </div>
    </div>
  );
};
