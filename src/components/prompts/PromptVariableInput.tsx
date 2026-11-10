import type { PromptVariable } from '../../data/prompts/types';

interface Props {
  variable: PromptVariable;
  value: string;
  onChange: (key: string, value: string) => void;
}

export const PromptVariableInput: React.FC<Props> = ({ variable, value, onChange }) => {
  const baseClass = 'w-full px-3 py-2 border border-rule-strong rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none';

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-ink-2 mb-1">
        {variable.label}
        {variable.required && <span className="text-error ml-1">*</span>}
      </label>
      {variable.type === 'textarea' ? (
        <textarea
          className={`${baseClass} h-24 resize-none`}
          placeholder={variable.placeholder}
          value={value}
          onChange={e => onChange(variable.key, e.target.value)}
        />
      ) : variable.type === 'select' ? (
        <select
          className={baseClass}
          value={value}
          onChange={e => onChange(variable.key, e.target.value)}
        >
          <option value="">请选择…</option>
          {variable.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className={baseClass}
          placeholder={variable.placeholder}
          value={value}
          onChange={e => onChange(variable.key, e.target.value)}
        />
      )}
    </div>
  );
};
