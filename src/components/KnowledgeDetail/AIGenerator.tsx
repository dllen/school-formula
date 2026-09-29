import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateKnowledgeContent } from '../../services/ai';

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
        <div className="pt-8 border-t border-[#F0F1F2]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center text-xl font-bold text-purple-900">
                    <span className="mr-2">✨</span> AI 智能助教
                    <span className="ml-3 text-sm font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        家长辅导助手
                    </span>
                </h3>
                {!aiContent && !isGenerating && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerateAI}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2"
                        >
                            <span>生成深度辅导指南</span>
                        </button>
                        <button
                            onClick={onPromptModalOpen}
                            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-200 transition-all flex items-center gap-2"
                        >
                            <span>📝 模板模式</span>
                        </button>
                    </div>
                )}
            </div>

            {isGenerating && !aiContent && (
                <div className="bg-purple-50 p-8 rounded-2xl border border-purple-100 text-center animate-pulse">
                    <p className="text-purple-800 font-medium">
                        正在思考中，为您生成专属辅导内容...
                    </p>
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
    );
};
