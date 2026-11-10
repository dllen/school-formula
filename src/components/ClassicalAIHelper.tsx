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

export const ClassicalAIHelper: React.FC<ClassicalAIHelperProps> = ({ title, source, content }) => {
    const [aiContent, setAiContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleGenerate = async () => {
        const config = getAIConfig();
        if (!config?.apiKey) {
            setIsSettingsOpen(true);
            return;
        }

        setIsGenerating(true);
        setAiContent('');

        try {
            await generateClassicalInterpretation(title, source, content, (chunk) => {
                setAiContent(prev => prev + chunk);
            });
        } catch (error) {
            console.error(error);
            alert('生成失败，请检查 API 配置');
        } finally {
            setIsGenerating(false);
        }
    };

    const isShiji = source === 'shiji';
    const actionColor = isShiji ? 'bg-ink text-ink-inverse' : 'bg-warning text-white';
    const shadowColor = isShiji ? 'hover:shadow-rule' : 'hover:shadow-warning-bg';
    const ringColor = isShiji ? 'ring-paper-2/50' : 'ring-warning-bg/50';
    const borderColor = isShiji ? 'border-paper-3' : 'border-warning-bg';
    const bgColor = isShiji ? 'bg-paper-2' : 'bg-warning-bg';
    const textColor = isShiji ? 'text-ink' : 'text-warning-ink';

    return (
        <div className="mt-8 pt-8 border-t border-paper-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="flex items-center text-xl font-bold text-ink">
                    <Icon name="sparkle" className="mr-2 w-5 h-5" /> AI 名师解读
                    <span className="ml-3 text-sm font-normal text-ink-3 bg-paper-3 px-2 py-0.5 rounded-full">
                        {isShiji ? '史记' : '资治通鉴'}
                    </span>
                </h3>
                {!aiContent && !isGenerating && (
                    <button
                        onClick={handleGenerate}
                        className={`px-6 py-2 ${actionColor} rounded-xl font-bold ${shadowColor} transition-[transform,box-shadow] flex items-center gap-2`}
                    >
                        <span>生成深度解读</span>
                    </button>
                )}
            </div>

            {isGenerating && !aiContent && (
                <div className={`${bgColor} p-8 rounded-2xl border ${borderColor} text-center animate-pulse`}>
                    <p className={`${textColor} font-medium`}>正在为您生成古文深度解读…</p>
                </div>
            )}

            {(aiContent || (isGenerating && aiContent)) && (
                <div className={`bg-white border ${borderColor} rounded-2xl p-8 shadow-sm ring-4 ${ringColor}`}>
                    <div className="prose max-w-none">
                        <ReactMarkdown>{aiContent}</ReactMarkdown>
                    </div>
                    {isGenerating && (
                        <p className="mt-4 text-ink-3 animate-pulse text-sm">正在撰写…</p>
                    )}
                </div>
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};
