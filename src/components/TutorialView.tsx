import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ALL_TUTORIALS, type Tutorial, type TutorialUnit } from '../data/tutorials';
import { generateTutorialContent, getAIConfig } from '../services/ai';
import { SettingsModal } from './SettingsModal';

const GRADES: { id: string; name: string }[] = [
  { id: '1', name: '一年级' },
  { id: '2', name: '二年级' },
  { id: '3', name: '三年级' },
  { id: '4', name: '四年级' },
  { id: '5', name: '五年级' },
  { id: '6', name: '六年级' },
];

export const TutorialView: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('1');
  const [selectedUnit, setSelectedUnit] = useState<TutorialUnit | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [aiContent, setAiContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const tutorial = ALL_TUTORIALS.find(t => t.grade === selectedGrade) || null;

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedUnit(null);
    setSelectedTutorial(null);
    setAiContent('');
  };

  const handleSelectUnit = (unit: TutorialUnit, t: Tutorial) => {
    setSelectedUnit(unit);
    setSelectedTutorial(t);
    setAiContent('');
  };

  const handleGenerateAI = async () => {
    if (!selectedUnit || !selectedTutorial) return;

    const config = getAIConfig();
    if (!config?.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsGenerating(true);
    setAiContent('');

    try {
      const context = `年级：${selectedTutorial.gradeName}，学科：${selectedTutorial.subject}，单元：${selectedUnit.title}，学习目标：${selectedUnit.objectives.join('；')}，静态内容：${selectedUnit.staticContent}`;
      await generateTutorialContent(selectedUnit.title, context, (chunk) => {
        setAiContent(prev => prev + chunk);
      });
    } catch (error) {
      console.error(error);
      alert('生成失败，请检查 API 配置');
    } finally {
      setIsGenerating(false);
    }
  };

  if (selectedUnit && selectedTutorial) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedUnit(null);
            setSelectedTutorial(null);
            setAiContent('');
          }}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教程列表
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{selectedTutorial.subjectIcon}</span>
              <div>
                <div className="text-sm text-indigo-600 font-medium">{selectedTutorial.gradeName} · {selectedTutorial.subject}</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedUnit.title}</h2>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full">⏱ {selectedUnit.duration}</span>
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full">第 {selectedUnit.order} 课</span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {selectedUnit.objectives.length > 0 && (
              <div>
                <h3 className="flex items-center text-xl font-bold text-indigo-900 mb-4">
                  <span className="mr-2">🎯</span> 学习目标
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedUnit.objectives.map((obj, idx) => (
                    <div key={idx} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start">
                      <span className="bg-indigo-200 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-indigo-900">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                <span className="mr-2">📖</span> 课程内容
              </h3>
              <div className="prose prose-indigo max-w-none bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <ReactMarkdown>{selectedUnit.staticContent}</ReactMarkdown>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="flex items-center text-xl font-bold text-purple-900">
                  <span className="mr-2">✨</span> AI 完整辅导教程
                  <span className="ml-3 text-sm font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    动态生成
                  </span>
                </h3>
                {!aiContent && !isGenerating && (
                  <button
                    onClick={handleGenerateAI}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2"
                  >
                    <span>生成完整辅导教程</span>
                  </button>
                )}
              </div>

              {isGenerating && !aiContent && (
                <div className="bg-purple-50 p-8 rounded-2xl border border-purple-100 text-center animate-pulse">
                  <p className="text-purple-800 font-medium">正在为孩子量身定制完整辅导教程...</p>
                </div>
              )}

              {(aiContent || (isGenerating && aiContent)) && (
                <div className="bg-white border border-purple-100 rounded-2xl p-8 shadow-sm ring-4 ring-purple-50/50">
                  <div className="prose prose-purple max-w-none">
                    <ReactMarkdown>{aiContent}</ReactMarkdown>
                  </div>
                  {isGenerating && (
                    <p className="mt-4 text-purple-500 animate-pulse text-sm">正在撰写...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">教程</h2>
          <p className="text-sm text-gray-500">系统学习小学数学，静态内容 + AI 动态辅导</p>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl shadow-inner sm:w-fit w-full">
          {GRADES.map((grade) => (
            <button
              key={grade.id}
              onClick={() => handleGradeChange(grade.id)}
              className={`
                flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${selectedGrade === grade.id
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }
              `}
            >
              {grade.name}
            </button>
          ))}
        </div>
      </div>

      {tutorial ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tutorial.subjectIcon}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{tutorial.title}</h3>
                <p className="text-sm text-gray-500">{tutorial.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorial.units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit, tutorial)}
                className="text-left bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    第 {unit.order} 课
                  </span>
                  <span className="text-xs text-gray-400">{unit.duration}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-3">
                  {unit.title}
                </h4>
                <ul className="space-y-1.5">
                  {unit.objectives.slice(0, 2).map((obj, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="line-clamp-2">{obj}</span>
                    </li>
                  ))}
                  {unit.objectives.length > 2 && (
                    <li className="text-xs text-gray-400 pl-4">+{unit.objectives.length - 2} 项目标</li>
                  )}
                </ul>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="text-6xl mb-4 grayscale opacity-30">📚</div>
          <p className="text-lg text-gray-400">该年级暂无教程</p>
        </div>
      )}
    </div>
  );
};
