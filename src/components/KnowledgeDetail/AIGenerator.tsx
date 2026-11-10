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
        <div className="pt-8 border-t border-[divider]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center text-xl font-bold text-accent-active">
                    <Icon name="sparkle" className="mr-2 w-5 h-5" /> AI 智能助教
                    <span className="ml-3 text-sm font-normal text-accent bg-accent-soft px-2 py-0.5 rounded-full">
                        家长辅导助手
                    </span>
                </h3>
                {!aiContent && !isGenerating && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerateAI}
                            className="px-6 py-2 bg-accent text-accent-ink rounded-xl font-bold hover:shadow-lg hover:shadow-accent-soft-hover transition-colors transition-shadow flex items-center gap-2"
                        >
                            <span>生成深度辅导指南</span>
                        </button>
                        <button
                            onClick={onPromptModalOpen}
                            className="px-6 py-2 bg-warning text-white rounded-xl font-bold hover:shadow-lg hover:shadow-warning-bg transition-colors transition-shadow flex items-center gap-2"
                        >
                            <span className="flex items-center gap-1.5"><Icon name="clipboard" className="w-4 h-4" />模板模式</span>
                        </button>
                    </div>
                )}
            </div>

            {isGenerating && !aiContent && (
                <div className="bg-accent-soft p-8 rounded-2xl border border-accent-soft text-center animate-pulse">
                    <p className="text-accent-active font-medium">
                        正在思考中，为您生成专属辅导内容…
                    </p>
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
    );
};
