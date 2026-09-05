import React, { useMemo } from 'react';
import type { QuestionFilter, Difficulty, QuestionType } from '../../data/questions/types';
import type { GradeLevel } from '../../data/types';
import { ALL_QUESTIONS } from '../../data/questions';

interface PracticeFilterProps {
  filter: QuestionFilter;
  onChange: (filter: QuestionFilter) => void;
  onStart: () => void;
  availableCount: number;
}

const GRADE_OPTIONS: { value: GradeLevel; label: string }[] = [
  { value: 'primary', label: '小学' },
  { value: 'middle', label: '初中' },
  { value: 'high', label: '高中' },
];

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

/** 获取指定年级下的所有科目 */
function getSubjectsByGrade(grade: GradeLevel | undefined): string[] {
  if (!grade) return [];
  return Array.from(new Set(ALL_QUESTIONS.filter(q => q.grade === grade).map(q => q.subject))).sort();
}

/** 获取指定年级+科目下的所有标签 */
function getTagsByScope(grade: GradeLevel | undefined, subject: string | undefined): string[] {
  const tagSet = new Set<string>();
  ALL_QUESTIONS.forEach(q => {
    if (grade && q.grade !== grade) return;
    if (subject && q.subject !== subject) return;
    q.tags.forEach(t => tagSet.add(t));
  });
  return Array.from(tagSet).sort();
}

export const PracticeFilter: React.FC<PracticeFilterProps> = ({
  filter,
  onChange,
  onStart,
  availableCount,
}) => {
  const subjects = useMemo(() => getSubjectsByGrade(filter.grade), [filter.grade]);
  const scopeTags = useMemo(
    () => getTagsByScope(filter.grade, filter.subject),
    [filter.grade, filter.subject]
  );

  const handleGradeChange = (grade: GradeLevel | undefined) => {
    // 切换年级时清空科目和标签（避免标签残留）
    onChange({ ...filter, grade, subject: undefined, tags: [] });
  };

  const handleSubjectChange = (subject: string | undefined) => {
    // 切换科目时清空标签
    onChange({ ...filter, subject, tags: [] });
  };

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
        <p className="text-sm text-gray-500">按年级和科目筛选，选择知识点标签、难度和题型开始练习</p>
      </div>

      {/* 年级 + 科目 下拉筛选 */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700 mb-2">年级与科目</legend>
        <div className="flex gap-3">
          <select
            value={filter.grade ?? ''}
            onChange={e => handleGradeChange(e.target.value ? (e.target.value as GradeLevel) : undefined)}
            aria-label="选择年级"
            className="flex-1 min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 transition-colors"
          >
            <option value="">全部年级</option>
            {GRADE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={filter.subject ?? ''}
            onChange={e => handleSubjectChange(e.target.value || undefined)}
            aria-label="选择科目"
            disabled={!filter.grade}
            className="flex-1 min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <option value="">{filter.grade ? '全部科目' : '请先选择年级'}</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* 知识点标签 — 按年级+科目联动 */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700 mb-2">
          知识点标签
          {filter.subject && (
            <span className="ml-2 text-xs font-normal text-gray-400">（{filter.subject}）</span>
          )}
        </legend>
        {scopeTags.length > 0 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="知识点标签筛选">
            {scopeTags.map(tag => (
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
        ) : (
          <p className="text-sm text-gray-400 italic">
            {filter.grade ? '该范围内暂无标签' : '请选择年级以查看标签'}
          </p>
        )}
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
