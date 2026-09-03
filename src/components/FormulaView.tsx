import React, { useMemo, useState } from 'react';
import { getFormulasByGrade, type Formula } from '../data/formulas';
import type { GradeLevel } from '../data/knowledge';
import { GradeSelector } from './GradeSelector';

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">公式宝典</h2>
          <p className="text-sm text-gray-500">小学到高中核心公式速查</p>
        </div>
        <GradeSelector selectedGrade={selectedGrade} onSelectGrade={setSelectedGrade} />
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索公式名称、关键词，如：勾股、面积、导数"
          className="flex-1 outline-none text-gray-700 placeholder:text-gray-400 bg-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            清空
          </button>
        )}
      </div>

      <div className="text-sm text-gray-500">
        共 {filteredFormulas.length} 个公式
      </div>

      {filteredFormulas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormulas.map((formula) => (
            <FormulaCard key={formula.id} formula={formula} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="text-6xl mb-4 grayscale opacity-30">📐</div>
          <p className="text-lg text-gray-400">没有找到匹配的公式</p>
          <p className="text-sm text-gray-400 mt-1">换个关键词试试</p>
        </div>
      )}
    </div>
  );
};

interface FormulaCardProps {
  formula: Formula;
}

const FormulaCard: React.FC<FormulaCardProps> = ({ formula }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900">{formula.name}</h3>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            {formula.subject}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">公式</p>
          <p className="text-gray-800 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg">{formula.expression}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">适用条件</p>
          <p className="text-gray-700 text-sm">{formula.condition}</p>
        </div>

        {formula.hint && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">推导提示</p>
            <p className="text-gray-600 text-sm leading-relaxed">{formula.hint}</p>
          </div>
        )}
      </div>
    </div>
  );
};
