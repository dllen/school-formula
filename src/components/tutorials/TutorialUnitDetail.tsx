import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Tutorial, TutorialUnit } from '../../data/tutorials';
import { generateTutorialContent, getAIConfig } from '../../services/ai';
import { SettingsModal } from '../SettingsModal';
import { TutorialLearnTab } from './TutorialLearnTab';
import { TutorialPractice } from './TutorialPractice';
import { TutorialTeachTab } from './TutorialTeachTab';
import { Icon, type IconName } from '../icons/Icon';
import { iconFor } from '../icons/iconFor';

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
    <div className="space-y-10">
      <header>
        <button type="button" onClick={onBack} className="btn btn-ghost tap-44 -ml-2">
          <Icon name="arrow-left" className="h-4 w-4" />
          返回教程列表
        </button>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-3">
              <span className="flex items-center gap-1.5">
                <Icon name={iconFor(tutorial.subjectIcon)} className="h-4 w-4" />
                {tutorial.subject}
              </span>
              <span>{tutorial.gradeName}</span>
              <span className="tabular">第 {unit.order} 课</span>
            </p>
            <h1 className="page-title mt-1">{unit.title}</h1>
          </div>

          <p className="flex items-center gap-1.5 text-label text-ink-2">
            <Icon name="clock" className="h-4 w-4 text-ink-3" />
            {unit.duration}
          </p>
        </div>
      </header>

      <div className="seg seg--wrap" role="group" aria-label="切换本课环节">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="seg-btn gap-1.5"
          >
            <Icon name={tab.icon} className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'teach' && <TutorialTeachTab unit={unit} />}
        {activeTab === 'learn' && <TutorialLearnTab unit={unit} />}
        {activeTab === 'practice' && <TutorialPractice unit={unit} tutorial={tutorial} />}
      </div>

      <section className="section" aria-labelledby="tutorial-ai">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="tutorial-ai" className="section-head">
              <Icon name="sparkle" className="h-5 w-5" />
              AI 家庭辅导指南
            </h2>
            <span className="tag">动态生成</span>
          </div>
          {!aiContent && !isGenerating && (
            <button type="button" onClick={handleGenerateAI} className="btn btn-secondary">
              生成家长辅导指南
            </button>
          )}
        </div>

        {isGenerating && !aiContent && (
          <div className="well mt-4" role="status">
            <p className="text-body-s text-ink-2">正在根据学习目标生成完整辅导方案…</p>
          </div>
        )}

        {(aiContent || (isGenerating && aiContent)) && (
          <div className="mt-4">
            <div className="prose-body">
              <ReactMarkdown>{aiContent}</ReactMarkdown>
            </div>
            {isGenerating && (
              <p className="mt-3 text-body-s text-ink-3" role="status">正在撰写…</p>
            )}
          </div>
        )}
      </section>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
