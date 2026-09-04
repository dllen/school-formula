import type { PromptVariable } from '../../data/prompts/types';

interface Props {
  variable: PromptVariable;
  value: string;
  onChange: (key: string, value: string) => void;
}

export const PromptVariableInput: React.FC<Props> = ({ variable, value, onChange }) => {
  const baseClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {variable.label}
        {variable.required && <span className="text-red-500 ml-1">*</span>}
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
          <option value="">请选择...</option>
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
