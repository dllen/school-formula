import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Tutorial, TutorialUnit } from '../../data/tutorials';
import { generateTutorialContent, getAIConfig } from '../../services/ai';
import { SettingsModal } from '../SettingsModal';
import { TutorialLearnTab } from './TutorialLearnTab';
import { TutorialPractice } from './TutorialPractice';
import { TutorialTeachTab } from './TutorialTeachTab';

type TabType = 'teach' | 'learn' | 'practice';

interface TutorialUnitDetailProps {
  unit: TutorialUnit;
  tutorial: Tutorial;
  onBack: () => void;
}

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'teach', label: '教', icon: '📖' },
  { id: 'learn', label: '学', icon: '💡' },
  { id: 'practice', label: '练', icon: '✏️' },
];

export const TutorialUnitDetail: React.FC<TutorialUnitDetailProps> = ({ unit, tutorial, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('teach');
  const [aiContent, setAiContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleGenerateAI = async () => {
    const config = getAIConfig();
    if (!config?.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsGenerating(true);
    setAiContent('');

    try {
      const context = `年级：${tutorial.gradeName}，学科：${tutorial.subject}，单元：${unit.title}，学习目标：${unit.objectives.join('；')}，教学内容：${unit.teach.summary}`;
      await generateTutorialContent(unit.title, context, (chunk) => {
        setAiContent(prev => prev + chunk);
      });
    } catch (error) {
      console.error(error);
      alert('生成失败，请检查 API 配置');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
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
            <span className="text-3xl">{tutorial.subjectIcon}</span>
            <div>
              <div className="text-sm text-indigo-600 font-medium">{tutorial.gradeName} · {tutorial.subject}</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{unit.title}</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full">⏱ {unit.duration}</span>
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full">第 {unit.order} 课</span>
          </div>
        </div>

        <div className="border-b border-gray-100">
          <div className="flex p-2 bg-gray-50">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'teach' && <TutorialTeachTab unit={unit} />}
          {activeTab === 'learn' && <TutorialLearnTab unit={unit} />}
          {activeTab === 'practice' && <TutorialPractice unit={unit} tutorial={tutorial} />}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="flex items-center text-xl font-bold text-purple-900">
              <span className="mr-2">✨</span> AI 家庭辅导指南
              <span className="ml-3 text-sm font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                动态生成
              </span>
            </h3>
            {!aiContent && !isGenerating && (
              <button
                onClick={handleGenerateAI}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2"
              >
                <span>生成家长辅导指南</span>
              </button>
            )}
          </div>

          {isGenerating && !aiContent && (
            <div className="bg-purple-50 p-8 rounded-2xl border border-purple-100 text-center animate-pulse">
              <p className="text-purple-800 font-medium">正在根据学习目标生成完整辅导方案...</p>
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

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
