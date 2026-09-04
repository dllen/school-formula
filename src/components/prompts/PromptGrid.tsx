import type { PromptTemplate } from '../../data/prompts/types';
import { PromptCard } from './PromptCard';

interface Props {
  templates: PromptTemplate[];
  onSelect: (template: PromptTemplate) => void;
}

export const PromptGrid: React.FC<Props> = ({ templates, onSelect }) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>没有找到匹配的提示词模板</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map(t => (
        <PromptCard key={t.id} template={t} onClick={onSelect} />
      ))}
    </div>
  );
};
