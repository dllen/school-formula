import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Tutorial, TutorialUnit } from '../../data/tutorials';
import { generateTutorialContent, getAIConfig } from '../../services/ai';
import { SettingsModal } from '../SettingsModal';
import { TutorialLearnTab } from './TutorialLearnTab';
import { TutorialPractice } from './TutorialPractice';
import { TutorialTeachTab } from './TutorialTeachTab';
import { Icon, type IconName } from '../icons/Icon';

type TabType = 'teach' | 'learn' | 'practice';

interface TutorialUnitDetailProps {
  unit: TutorialUnit;
  tutorial: Tutorial;
  onBack: () => void;
}

const TABS: { id: TabType; label: string; icon: IconName }[] = [
  { id: 'teach', label: '教', icon: 'book-open' },
  { id: 'learn', label: '学', icon: 'idea' },
  { id: 'practice', label: '练', icon: 'pencil' },
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
        className="flex items-center text-ink-3 hover:text-ink transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回教程列表
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-paper-3 overflow-hidden">
        <div className="p-8 border-b border-paper-3 bg-accent-soft">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{tutorial.subjectIcon}</span>
            <div>
              <div className="text-sm text-accent font-medium">{tutorial.gradeName} · {tutorial.subject}</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">{unit.title}</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-3">
            <span className="bg-white border border-rule px-3 py-1 rounded-full flex items-center gap-1.5"><Icon name="clock" className="w-3.5 h-3.5" />{unit.duration}</span>
            <span className="bg-white border border-rule px-3 py-1 rounded-full">第 {unit.order} 课</span>
          </div>
        </div>

        <div className="border-b border-paper-3">
          <div className="flex p-2 bg-paper-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-accent shadow-sm'
                    : 'text-ink-3 hover:text-ink-2 hover:bg-paper-3'
                }`}
              >
                <Icon name={tab.icon} className="mr-1.5 w-4 h-4" />
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

      <div className="bg-white rounded-3xl shadow-sm border border-paper-3 overflow-hidden">
        <div className="p-8 border-t border-paper-3">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="flex items-center text-xl font-bold text-accent-active">
              <Icon name="sparkle" className="mr-2 w-5 h-5" /> AI 家庭辅导指南
              <span className="ml-3 text-sm font-normal text-accent bg-accent-soft px-2 py-0.5 rounded-full">
                动态生成
              </span>
            </h3>
            {!aiContent && !isGenerating && (
              <button
                onClick={handleGenerateAI}
                className="px-6 py-2 bg-accent text-accent-ink rounded-xl font-bold hover:shadow-lg hover:shadow-accent-soft-hover transition-colors transition-shadow flex items-center gap-2"
              >
                <span>生成家长辅导指南</span>
              </button>
            )}
          </div>

          {isGenerating && !aiContent && (
            <div className="bg-accent-soft p-8 rounded-2xl border border-accent-soft text-center animate-pulse">
              <p className="text-accent-active font-medium">正在根据学习目标生成完整辅导方案…</p>
            </div>
          )}

          {(aiContent || (isGenerating && aiContent)) && (
            <div className="bg-white border border-accent-soft rounded-2xl p-8 shadow-sm ring-4 ring-accent-soft/50">
              <div className="prose prose-purple max-w-none">
                <ReactMarkdown>{aiContent}</ReactMarkdown>
              </div>
              {isGenerating && (
                <p className="mt-4 text-accent animate-pulse text-sm">正在撰写…</p>
              )}
            </div>
          )}
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
