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
      className="text-left w-full bg-white rounded-2xl shadow-sm border border-[#F0F1F2] p-5 hover:border-[#3370FF] hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-[#1F2329] font-['Noto_Serif_SC']">{poem.title}</h3>
        <div className="flex flex-wrap gap-1 justify-end shrink-0">
          <Badge>{DYNASTY_LABEL[poem.dynasty]}</Badge>
          <Badge>{GRADE_LABEL[poem.grade]}</Badge>
          <Badge>{poem.theme}</Badge>
        </div>
      </div>
      <p className="text-sm text-[#646A73] mb-3 font-['Noto_Serif_SC']">—— {poem.author} ——</p>
      <p className="text-base text-[#1F2329] font-['Noto_Serif_SC'] leading-relaxed">
        {preview}……
      </p>
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] text-[#646A73] bg-[#F5F6F7] rounded">
      {children}
    </span>
  );
}