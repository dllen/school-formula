import { useState } from 'react';
import type { PromptTemplate } from '../../data/prompts/types';
import { PromptVariableInput } from './PromptVariableInput';

interface Props {
  template: PromptTemplate;
  prefilledVars?: Record<string, string>;
  onSend: (variables: Record<string, string>) => void;
  onCopy: () => void;
  onBack: () => void;
}

export const PromptDetail: React.FC<Props> = ({ template, prefilledVars, onSend, onCopy, onBack }) => {
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
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">← 返回</button>
        <span className="text-xl">{template.icon}</span>
        <h3 className="text-lg font-bold">{template.title}</h3>
      </div>
      <p className="text-sm text-gray-500">{template.description}</p>
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          🚀 发送 AI
        </button>
        <button
          onClick={onCopy}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          📋 复制 Prompt
        </button>
      </div>
    </div>
  );
};
