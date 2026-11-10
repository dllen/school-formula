import { useState } from 'react';
import type { PromptTemplate } from '../../data/prompts/types';
import { PromptVariableInput } from './PromptVariableInput';
import { Icon } from '../icons/Icon';
import { iconFor } from '../icons/iconFor';

interface Props {
  template: PromptTemplate;
  prefilledVars?: Record<string, string>;
  onSend: (variables: Record<string, string>) => void;
  onCopy: () => void;
  onBack: () => void;
  copied?: boolean;
}

export const PromptDetail: React.FC<Props> = ({ template, prefilledVars, onSend, onCopy, onBack, copied }) => {
  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.variables.forEach(v => {
      initial[v.key] = prefilledVars?.[v.key] || v.defaultValue || '';
    });
    return initial;
  });

  const allRequiredFilled = template.variables
    .filter(v => v.required)
    .every(v => variables[v.key]?.trim());

  const handleChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-ink-3 hover:text-ink-2">← 返回</button>
        <Icon name={iconFor(template.icon)} className="w-6 h-6 text-accent" />
        <h3 className="text-lg font-bold">{template.title}</h3>
      </div>
      <p className="text-sm text-ink-3">{template.description}</p>
      <div className="border-t pt-4">
        {template.variables.map(v => (
          <PromptVariableInput
            key={v.key}
            variable={v}
            value={variables[v.key]}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSend(variables)}
          disabled={!allRequiredFilled}
          className="px-4 py-2 bg-accent text-accent-ink rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
        >
          <span className="flex items-center gap-1.5"><Icon name="spark" className="w-4 h-4" />发送 AI</span>
        </button>
        <button
          onClick={onCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            copied
              ? 'bg-success-bg text-success-ink border border-success-bg'
              : 'border border-rule-strong hover:bg-paper-2'
          }`}
        >
          {copied ? (
              <span className="flex items-center gap-1.5">
                <Icon name="check" className="w-4 h-4" />已复制
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Icon name="copy" className="w-4 h-4" />复制 Prompt
              </span>
            )}
        </button>
      </div>
    </div>
  );
};
