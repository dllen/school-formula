import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateClassicalInterpretation, getAIConfig } from '../services/ai';
import { SettingsModal } from './SettingsModal';
import { Icon } from './icons/Icon';

interface ClassicalAIHelperProps {
    title: string;
    source: 'shiji' | 'zizhi';
    content: string[];
}

/**
 * 古文解读的一段平铺章节：标题、一个主动作、流式结果落在纸面凹槽里。
 * 加载与失败都是文字，不是空转的骨架块。
 */
export const ClassicalAIHelper: React.FC<ClassicalAIHelperProps> = ({ title, source, content }) => {
    const [aiContent, setAiContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        const config = getAIConfig();
        if (!config?.apiKey) {
            setIsSettingsOpen(true);
            return;
        }

        setIsGenerating(true);
        setAiContent('');
        setError('');

        try {
            await generateClassicalInterpretation(title, source, content, (chunk) => {
                setAiContent(prev => prev + chunk);
            });
        } catch (generateError) {
            console.error(generateError);
            setError('生成失败，请检查 API 配置后重试。');
        } finally {
            setIsGenerating(false);
        }
    };

    const sourceLabel = source === 'shiji' ? '史记' : '资治通鉴';

    return (
        <section className="section" aria-labelledby="classical-ai-heading">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h2 id="classical-ai-heading" className="section-head">
                        <Icon name="sparkle" className="h-4 w-4" />
                        AI 名师解读
                    </h2>
                    <span className="tag">{sourceLabel}</span>
                </div>
                {!isGenerating && !aiContent && !error && (
                    <button type="button" onClick={handleGenerate} className="btn btn-primary">
                        生成深度解读
                    </button>
                )}
                {!isGenerating && (aiContent || error) && (
                    <button type="button" onClick={handleGenerate} className="btn btn-secondary">
                        重新生成
                    </button>
                )}
            </div>

            {isGenerating && !aiContent && (
                <p className="mt-6 flex items-center gap-2 text-body-s text-ink-2" role="status" aria-live="polite">
                    <span
                        className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-divider border-t-accent"
                        aria-hidden="true"
                    />
                    正在为您生成古文深度解读…
                </p>
            )}

            {error && (
                <p className="mt-6 text-body-s text-error-ink" role="alert">
                    {error}
                </p>
            )}

            {aiContent && (
                <div className="well mt-6">
                    <div className="prose-body">
                        <ReactMarkdown components={{ h1: 'h3' }}>{aiContent}</ReactMarkdown>
                    </div>
                    {isGenerating && (
                        <p className="mt-4 flex items-center gap-2 text-body-s text-ink-2" role="status" aria-live="polite">
                            <span
                                className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-divider border-t-accent"
                                aria-hidden="true"
                            />
                            正在撰写…
                        </p>
                    )}
                </div>
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </section>
    );
};
