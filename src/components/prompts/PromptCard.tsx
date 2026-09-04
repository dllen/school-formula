import type { PromptTemplate } from '../../data/prompts/types';

interface Props {
  template: PromptTemplate;
  onClick: (template: PromptTemplate) => void;
}

export const PromptCard: React.FC<Props> = ({ template, onClick }) => {
  return (
    <button
      onClick={() => onClick(template)}
      className="text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{template.icon}</span>
        <span className="text-xs text-gray-400">⭐ {template.rating}</span>
      </div>
      <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
        {template.title}
      </h4>
      <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {template.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
};
