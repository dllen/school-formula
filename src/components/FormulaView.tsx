import React, { useMemo, useState } from 'react';
import { getFormulasByGrade, type Formula } from '../data/formulas';
import type { GradeLevel } from '../data/knowledge';
import { GradeSelector } from './GradeSelector';
import { Icon } from './icons/Icon';

export const FormulaView: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('primary');
  const [query, setQuery] = useState('');

  const allFormulas = getFormulasByGrade(selectedGrade);

  const filteredFormulas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return allFormulas;
    return allFormulas.filter((formula) => {
      const searchable = [
        formula.name,
        formula.expression,
        formula.subject,
        formula.condition,
        formula.hint ?? '',
      ].join(' ').toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [allFormulas, query]);

  return (
    <>
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">公式宝典</h1>
          <p className="page-lead">小学到高中核心公式速查</p>
        </div>
        <div className="page-controls w-full sm:w-auto">
          <GradeSelector selectedGrade={selectedGrade} onSelectGrade={setSelectedGrade} />
          <div className="flex w-full items-center gap-2 sm:w-80">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索公式名称、关键词，如：勾股、面积、导数"
              aria-label="搜索公式"
              autoComplete="off"
              className="input min-w-0 flex-1"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="btn btn-ghost"
              >
                清空
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="tabular text-label font-semibold text-ink-2">
        共 {filteredFormulas.length} 个公式
      </p>

      {filteredFormulas.length > 0 ? (
        <ul className="mt-2 grid grid-cols-1 gap-x-10 border-t border-divider md:grid-cols-2">
          {filteredFormulas.map((formula) => (
            <FormulaRow key={formula.id} formula={formula} />
          ))}
        </ul>
      ) : (
        <div className="empty-state mt-2">
          <Icon name="function" className="h-10 w-10" />
          <p className="text-body-s text-ink-2">没有找到匹配的公式</p>
          <p className="text-body-s text-ink-3">换个关键词试试</p>
        </div>
      )}
    </>
  );
};

interface FormulaRowProps {
  formula: Formula;
}

const FormulaRow: React.FC<FormulaRowProps> = ({ formula }) => {
  return (
    <li className="border-b border-divider py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="min-w-0 text-title font-semibold text-ink">{formula.name}</h2>
        <span className="shrink-0 text-caption text-ink-3">{formula.subject}</span>
      </div>

      <p className="well tabular mt-2 overflow-x-auto font-mono text-body-s text-ink">
        {formula.expression}
      </p>

      <dl className="mt-3 space-y-2">
        <div>
          <dt className="text-caption text-ink-3">适用条件</dt>
          <dd className="mt-0.5 text-body-s text-ink">{formula.condition}</dd>
        </div>

        {formula.hint && (
          <div>
            <dt className="text-caption text-ink-3">推导提示</dt>
            <dd className="mt-0.5 text-body-s text-ink-2">{formula.hint}</dd>
          </div>
        )}
      </dl>
    </li>
  );
};
