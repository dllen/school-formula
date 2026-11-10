import type { PromptTemplate } from '../../data/prompts/types';
import { Icon } from '../icons/Icon';
import { iconFor } from '../icons/iconFor';

interface Props {
  template: PromptTemplate;
  onClick: (template: PromptTemplate) => void;
}

export const PromptCard: React.FC<Props> = ({ template, onClick }) => {
  return (
    <button
      onClick={() => onClick(template)}
      className="text-left bg-white p-4 rounded-xl border border-paper-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-colors transition-shadow group w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <Icon name={iconFor(template.icon)} className="w-7 h-7 text-accent" />
        <span className="text-xs text-ink-3 flex items-center gap-1"><Icon name="star" className="w-3.5 h-3.5" />{template.rating}</span>
      </div>
      <h4 className="text-sm font-bold text-ink group-hover:text-accent transition-colors mb-1">
        {template.title}
      </h4>
      <p className="text-xs text-ink-3 line-clamp-2">{template.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {template.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] bg-paper-3 text-ink-3 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
};
