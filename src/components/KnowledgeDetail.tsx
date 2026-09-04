import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { getQuestionsByKnowledgePoint } from '../data/questions';
import { generateKnowledgeContent, getAIConfig } from '../services/ai';
import { SettingsModal } from './SettingsModal';
import { PromptModal } from './prompts/PromptModal';

export const KnowledgeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [aiContent, setAiContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    // Find the knowledge point in the data
    const findKnowledgePoint = (pointId: string | undefined) => {
        if (!pointId) return null;
        for (const grade of KNOWLEDGE_DATA) {
            for (const subject of grade.subjects) {
                const point = subject.knowledgePoints.find(p => p.id === pointId);
                if (point) return { point, subject, grade };
            }
        }
        return null;
    };

    const data = findKnowledgePoint(id);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到该知识点</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        返回首页
                    </button>
                </div>
            </div>
        );
    }

    const { point, subject, grade } = data;

    const handleGenerateAI = async () => {
        const config = getAIConfig();
        if (!config?.apiKey) {
            setIsSettingsOpen(true);
            return;
        }

        setIsGenerating(true);
        setAiContent('');

        try {
            const context = `年级：${grade.name}，学科：${subject.name}，知识点：${point.title}，描述：${point.description}`;
            await generateKnowledgeContent(point.title, context, (chunk) => {
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
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <span className="mr-2">←</span> 返回列表
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-4xl">{subject.icon}</span>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold text-gray-900">{point.title}</h1>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                        {subject.name}
                                    </span>
                                </div>
                                <p className="text-gray-500 mt-2 text-lg">{point.description}</p>
                            </div>
                        </div>

                        {point.tags && (
                            <div className="flex gap-2 mt-4">
                                {point.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white border border-blue-100 text-blue-600 text-sm rounded-full shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">

                        {/* Detailed Explanation */}
                        {point.detailedExplanation ? (
                            <div className="prose prose-lg prose-blue max-w-none">
                                <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                                    <span className="mr-2">💡</span> 详细解析
                                </h3>
                                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-50 text-gray-700 whitespace-pre-line leading-relaxed">
                                    {point.detailedExplanation}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p>暂无详细解析内容</p>
                            </div>
                        )}

                        {/* Study Tips */}
                        {point.studyTips && point.studyTips.length > 0 && (
                            <div>
                                <h3 className="flex items-center text-xl font-bold text-amber-900 mb-4">
                                    <span className="mr-2">🎓</span> 学习技巧
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {point.studyTips.map((tip, idx) => (
                                        <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start">
                                            <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <p className="text-amber-900">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Practice Questions */}
                        {point.practiceQuestions && point.practiceQuestions.length > 0 && (
                            <div>
                                <h3 className="flex items-center text-xl font-bold text-green-900 mb-4">
                                    <span className="mr-2">✏️</span> 实战练习
                                </h3>
                                <div className="space-y-4">
                                    {point.practiceQuestions.map((q, idx) => (
                                        <div key={idx} className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm">
                                            <div className="bg-green-50 p-4 border-b border-green-100">
                                                <p className="font-bold text-green-900">Q{idx + 1}: {q.question}</p>
                                            </div>
                                            <div className="p-4 bg-white">
                                                <p className="text-gray-600">
                                                    <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded mr-2">参考答案</span>
                                                    {q.answer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Practice Section */}
                        {(() => {
                            const relatedQuestions = getQuestionsByKnowledgePoint(point.id);
                            if (relatedQuestions.length === 0) return null;
                            return (
                                <div className="pt-8 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="flex items-center text-xl font-bold text-green-900">
                                            <span className="mr-2">✏️</span> 巩固练习
                                            <span className="ml-3 text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                {relatedQuestions.length} 道题
                                            </span>
                                        </h3>
                                        <button
                                            onClick={() => {
                                                const params = new URLSearchParams({ view: 'practice', kp: point.id });
                                                window.location.href = `/?${params.toString()}`;
                                            }}
                                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all"
                                        >
                                            开始练习
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Fun Section */}
                        {(point.funFact || point.funStory || point.funQuestion) && (
                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="flex items-center text-xl font-bold text-amber-900 mb-4">
                                    <span className="mr-2">🌟</span> 趣味角
                                </h3>
                                <div className="space-y-4">
                                    {point.funFact && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                                            <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                                <span>🧊</span> 冷知识
                                            </h4>
                                            <p className="text-amber-800 leading-relaxed">{point.funFact}</p>
                                        </div>
                                    )}

                                    {point.funStory && (
                                        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                                            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                                <span>📖</span> 生活中的数学
                                            </h4>
                                            <p className="text-green-800 leading-relaxed">{point.funStory}</p>
                                        </div>
                                    )}

                                    {point.funQuestion && (
                                        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
                                            <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                                <span>❓</span> 互动问答
                                            </h4>
                                            <p className="text-purple-800 mb-3">{point.funQuestion}</p>
                                            <details className="group">
                                                <summary className="cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-800 list-none flex items-center gap-1">
                                                    <span className="group-open:rotate-90 transition-transform">▶</span>
                                                    点击揭晓答案
                                                </summary>
                                                <div className="mt-3 p-3 bg-white rounded-xl border border-purple-100">
                                                    <p className="text-purple-700">{point.funQuestionAnswer || '暂无答案'}</p>
                                                </div>
                                            </details>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* AI Generation Section */}
                        <div className="pt-8 border-t border-gray-100">
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
                                            onClick={() => setIsPromptModalOpen(true)}
                                            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-200 transition-all flex items-center gap-2"
                                        >
                                            <span>📝 模板模式</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isGenerating && !aiContent && (
                                <div className="bg-purple-50 p-8 rounded-2xl border border-purple-100 text-center animate-pulse">
                                    <p className="text-purple-800 font-medium">正在思考中，为您生成专属辅导内容...</p>
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
            </div>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <PromptModal
                isOpen={isPromptModalOpen}
                onClose={() => setIsPromptModalOpen(false)}
                knowledgePointId={point.id}
                knowledgePointTitle={point.title}
                knowledgePointGrade={grade.name}
            />
        </div>
    );
};
