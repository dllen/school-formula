import type { GradeLevel } from '../../data/knowledge';
import type { PromptScenario } from '../../data/prompts/types';

interface Props {
  grade: GradeLevel | '';
  subject: string;
  scenario: PromptScenario | '';
  searchQuery: string;
  resultCount: number;
  onGradeChange: (grade: GradeLevel | '') => void;
  onSubjectChange: (subject: string) => void;
  onScenarioChange: (scenario: PromptScenario | '') => void;
  onSearchChange: (query: string) => void;
}

const SUBJECTS = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理'];
const SCENARIOS: { value: PromptScenario; label: string }[] = [
  { value: 'explain', label: '知识讲解' },
  { value: 'generate', label: '出题组卷' },
  { value: 'assess', label: '测评批改' },
  { value: 'plan', label: '学习计划' },
  { value: 'error-analysis', label: '错题分析' },
  { value: 'derivation', label: '公式推导' },
  { value: 'explore', label: '拓展探究' },
  { value: 'interaction', label: '亲子互动' },
];

export const PromptFilterBar: React.FC<Props> = ({
  grade, subject, scenario, searchQuery, resultCount,
  onGradeChange, onSubjectChange, onScenarioChange, onSearchChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <select
          value={grade}
          onChange={e => onGradeChange(e.target.value as GradeLevel | '')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">全部年级</option>
          <option value="primary">小学</option>
          <option value="middle">初中</option>
          <option value="high">高中</option>
        </select>
        <select
          value={subject}
          onChange={e => onSubjectChange(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">全部学科</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={scenario}
          onChange={e => onScenarioChange(e.target.value as PromptScenario | '')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">全部场景</option>
          {SCENARIOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input
          type="text"
          placeholder="🔍 搜索提示词..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="flex-1 min-w-[160px] px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <p className="text-xs text-gray-400">共 {resultCount} 个模板</p>
    </div>
  );
};
