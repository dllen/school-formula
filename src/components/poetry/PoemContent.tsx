import { useState } from 'react';
import type { Poem } from '../../data/poems/types';
import { Icon } from '../icons/Icon';

interface PoemContentProps {
  poem: Poem;
}

const DYNASTY_LABEL: Record<Poem['dynasty'], string> = { tang: '唐', song: '宋' };
const GRADE_LABEL: Record<Poem['grade'], string> = { primary: '小学', middle: '初中', high: '高中' };

/**
 * 一首诗的阅读面：题目居首，诗行用宋体排到 display-s，
 * 译文与赏析各占一段，段与段之间只用发丝线相连。
 */
export function PoemContent({ poem }: PoemContentProps) {
  const [showPinyin, setShowPinyin] = useState(true);

  return (
    <article className="w-full pb-16">
      <header className="pt-6">
        <h1 className="font-serif text-display font-semibold text-ink">
          {poem.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-serif text-body-s text-ink-3">
          <span className="text-body text-ink-2">{poem.author}</span>
          <MetaSep />
          <span>{DYNASTY_LABEL[poem.dynasty]}</span>
          <MetaSep />
          <span>{GRADE_LABEL[poem.grade]}</span>
          <MetaSep />
          <span>{poem.theme}</span>
          <MetaSep />
          <span>{poem.form}</span>
          {poem.cipai && (
            <>
              <MetaSep />
              <span>{poem.cipai}</span>
            </>
          )}
        </div>
      </header>

      <section aria-label="诗文" className="mt-10">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowPinyin((v) => !v)}
            aria-pressed={showPinyin}
            className="btn btn-ghost"
          >
            {showPinyin ? '隐藏拼音' : '显示拼音'}
          </button>
        </div>

        <div className="mt-6 space-y-6 text-center">
          {poem.content.map((line, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="font-serif text-display-s leading-relaxed text-ink">
                {line}
              </p>
              {showPinyin && poem.pinyin[idx] && (
                <p className="text-caption text-ink-3">{poem.pinyin[idx]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-head">
          <Icon name="book-open" className="h-4 w-4" />
          译文
        </h2>
        <div className="prose-body mt-3">
          <p>{poem.translation}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-head">
          <Icon name="sparkle" className="h-4 w-4" />
          赏析
        </h2>
        <div className="prose-body mt-3">
          <p>{poem.appreciation}</p>
        </div>
      </section>
    </article>
  );
}

function MetaSep() {
  return <span aria-hidden="true" className="h-3 w-px bg-rule" />;
}
