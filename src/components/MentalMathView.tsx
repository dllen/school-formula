import React, { useMemo, useState } from 'react';
import { getMentalMathByGrade, type MentalMathMnemonic } from '../data/mentalMath';
import type { GradeLevel } from '../data/knowledge';
import { GradeSelector } from './GradeSelector';
import { Icon } from './icons/Icon';

export const MentalMathView: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('primary');
  const [query, setQuery] = useState('');

  const allItems = getMentalMathByGrade(selectedGrade);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return allItems;
    return allItems.filter((item) => {
      const searchable = [
        item.title,
        item.rhyme,
        item.scene,
        ...item.tags,
      ].join(' ').toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [allItems, query]);

  return (
    <>
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">速算口诀</h1>
          <p className="page-lead">小学到高中常用速算技巧与口诀</p>
        </div>
        <div className="page-controls w-full sm:w-auto">
          <GradeSelector selectedGrade={selectedGrade} onSelectGrade={setSelectedGrade} />
          <div className="flex w-full items-center gap-2 sm:w-80">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索口诀、场景或标签，如：凑十、平方、估算"
              aria-label="搜索口诀"
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
        共 {filteredItems.length} 条口诀
      </p>

      {filteredItems.length > 0 ? (
        <ul className="mt-2 grid grid-cols-1 gap-x-10 border-t border-divider md:grid-cols-2">
          {filteredItems.map((item) => (
            <MnemonicRow key={item.id} mnemonic={item} />
          ))}
        </ul>
      ) : (
        <div className="empty-state mt-2">
          <Icon name="math" className="h-10 w-10" />
          <p className="text-body-s text-ink-2">没有找到匹配的口诀</p>
          <p className="text-body-s text-ink-3">换个关键词试试</p>
        </div>
      )}
    </>
  );
};

interface MnemonicRowProps {
  mnemonic: MentalMathMnemonic;
}

const MnemonicRow: React.FC<MnemonicRowProps> = ({ mnemonic }) => {
  return (
    <li className="border-b border-divider py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="min-w-0 text-title font-semibold text-ink">{mnemonic.title}</h2>
        <div className="flex flex-wrap gap-1.5">
          {mnemonic.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-2 whitespace-pre-line text-body font-semibold text-ink">
        {mnemonic.rhyme}
      </p>

      <dl className="mt-3 space-y-2">
        <div>
          <dt className="text-caption text-ink-3">适用场景</dt>
          <dd className="mt-0.5 text-body-s text-ink">{mnemonic.scene}</dd>
        </div>

        <div>
          <dt className="text-caption text-ink-3">示例</dt>
          <dd className="well tabular mt-1 overflow-x-auto whitespace-pre-line font-mono text-body-s text-ink">
            {mnemonic.example}
          </dd>
        </div>

        {mnemonic.explanation && (
          <div>
            <dt className="text-caption text-ink-3">原理说明</dt>
            <dd className="mt-0.5 text-body-s text-ink-2">{mnemonic.explanation}</dd>
          </div>
        )}
      </dl>
    </li>
  );
};
