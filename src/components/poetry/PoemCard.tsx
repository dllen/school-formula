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

export function PoemCard({ poem, onClick }: PoemCardProps) {
  const preview = poem.content.slice(0, 2).join('，');

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full bg-white rounded-2xl shadow-sm border border-[divider] p-5 hover:border-[accent] hover:shadow-md transition-colors transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-[ink] font-serif">{poem.title}</h3>
        <div className="flex flex-wrap gap-1 justify-end shrink-0">
          <Badge>{DYNASTY_LABEL[poem.dynasty]}</Badge>
          <Badge>{GRADE_LABEL[poem.grade]}</Badge>
          <Badge>{poem.theme}</Badge>
        </div>
      </div>
      <p className="text-sm text-ink-2 mb-3 font-serif">{poem.author}</p>
      <p className="text-base text-[ink] font-serif leading-relaxed">
        {preview}……
      </p>
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] text-[ink-2] bg-[paper-2] rounded">
      {children}
    </span>
  );
}