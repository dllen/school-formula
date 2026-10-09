import { useState } from 'react';
import type { Poem } from '../../data/poems/types';

interface PoemContentProps {
  poem: Poem;
}

const DYNASTY_LABEL: Record<Poem['dynasty'], string> = { tang: '唐', song: '宋' };
const GRADE_LABEL: Record<Poem['grade'], string> = { primary: '小学', middle: '初中', high: '高中' };

export function PoemContent({ poem }: PoemContentProps) {
  const [showPinyin, setShowPinyin] = useState(true);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-[#1F2329] font-['Noto_Serif_SC']">
          {poem.title}
        </h1>
        <p className="text-base text-[#646A73] font-['Noto_Serif_SC']">
          —— {poem.author} ——
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge>{DYNASTY_LABEL[poem.dynasty]}</Badge>
          <Badge>{GRADE_LABEL[poem.grade]}</Badge>
          <Badge>{poem.theme}</Badge>
          <Badge>{poem.form}</Badge>
          {poem.cipai && <Badge>{poem.cipai}</Badge>}
        </div>
      </header>

      {/* Body */}
      <section className="space-y-4 py-4">
        {poem.content.map((line, idx) => (
          <div key={idx} className="text-center space-y-1">
            <p className="text-2xl leading-relaxed text-[#1F2329] font-['Noto_Serif_SC']">
              {line}
            </p>
            {showPinyin && poem.pinyin[idx] && (
              <p className="text-sm text-[#8F959E]">{poem.pinyin[idx]}</p>
            )}
          </div>
        ))}
      </section>

      {/* Pinyin toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowPinyin((v) => !v)}
          className="text-xs text-[#3370FF] hover:underline"
        >
          {showPinyin ? '隐藏拼音' : '显示拼音'}
        </button>
      </div>

      <Divider />

      {/* Translation */}
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-[#646A73] flex items-center gap-2">
          <span aria-hidden="true">📖</span>译文
        </h2>
        <p className="text-base text-[#1F2329] leading-relaxed">{poem.translation}</p>
      </section>

      <Divider />

      {/* Appreciation */}
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-[#646A73] flex items-center gap-2">
          <span aria-hidden="true">✨</span>赏析
        </h2>
        <p className="text-base text-[#1F2329] leading-relaxed">{poem.appreciation}</p>
      </section>
    </article>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs text-[#646A73] bg-[#F5F6F7] rounded">
      {children}
    </span>
  );
}

function Divider() {
  return <hr className="border-t border-[#F0F1F2]" />;
}