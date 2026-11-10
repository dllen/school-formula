import type { Dynasty, Poem } from '../../data/poems/types';

interface PoemCardProps {
  poem: Poem;
  onClick: () => void;
}

const DYNASTY_LABEL: Record<Dynasty, string> = {
  tang: '唐',
  song: '宋',
};

const GRADE_LABEL: Record<Poem['grade'], string> = {
  primary: '小学',
  middle: '初中',
  high: '高中',
};

/**
 * 诗单里的一行：题目、作者、朝代与学段、第一句。
 * 行与行之间只用一道发丝线分隔，不做卡片。
 */
export function PoemCard({ poem, onClick }: PoemCardProps) {
  const preview = poem.content.slice(0, 2).join('，');

  return (
    <li className="border-b border-divider">
      <button
        type="button"
        onClick={onClick}
        className="block w-full px-2 py-4 text-left transition-colors hover:bg-paper-2"
      >
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-serif text-title font-semibold text-ink">{poem.title}</span>
          <span className="flex flex-wrap items-center gap-x-2 text-caption text-ink-3">
            <span>{DYNASTY_LABEL[poem.dynasty]}</span>
            <span aria-hidden="true" className="h-3 w-px bg-rule" />
            <span>{GRADE_LABEL[poem.grade]}</span>
            <span aria-hidden="true" className="h-3 w-px bg-rule" />
            <span>{poem.theme}</span>
          </span>
        </span>
        <span className="mt-1 block font-serif text-body-s text-ink-2">{poem.author}</span>
        <span className="mt-2 block font-serif text-body-s text-ink-2">
          {preview}……
        </span>
      </button>
    </li>
  );
}
