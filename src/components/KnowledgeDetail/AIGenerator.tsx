import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateKnowledgeContent } from '../../services/ai';
import { Icon } from '../icons/Icon';

type AIGeneratorProps = {
    topic: string;
    context: string;
    knowledgePointTitle: string;
    knowledgePointGrade: string;
    onPromptModalOpen: () => void;
};

export const AIGenerator: React.FC<AIGeneratorProps> = ({
    topic,
    context,
    onPromptModalOpen,
}) => {
    const [aiContent, setAiContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        setAiContent('');
        try {
            await generateKnowledgeContent(topic, context, (chunk) => {
                setAiContent((prev) => prev + chunk);
            });
        } catch (error) {
            console.error(error);
            alert('生成失败，请检查 API 配置');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section id="ai" className="section">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="min-w-0">
                    <h2 className="section-head">
                        <Icon name="sparkle" className="h-5 w-5" />
                        AI 智能助教
                    </h2>
                    <p className="section-note">家长辅导助手</p>
                </div>
                {!aiContent && !isGenerating && (
                    <div className="flex flex-wrap gap-2">
                        <button type="button" className="btn btn-primary" onClick={handleGenerateAI}>
                            生成深度辅导指南
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onPromptModalOpen}>
                            <Icon name="clipboard" className="h-4 w-4" />
                            模板模式
                        </button>
                    </div>
                )}
            </div>

            {isGenerating && !aiContent && (
                <div className="mt-6 flex items-center gap-2" role="status" aria-live="polite">
                    <span
                        className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-divider border-t-accent"
                        aria-hidden="true"
                    />
                    <span className="text-body-s text-ink-2">正在思考中，为您生成专属辅导内容…</span>
                </div>
            )}

            {aiContent && (
                <div className="well mt-6">
                    <div className="prose-body">
                        <ReactMarkdown>{aiContent}</ReactMarkdown>
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
        </section>
    );
};
