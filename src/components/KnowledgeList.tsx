import React, { useState } from 'react';
import type { Subject } from '../data/knowledge';

interface KnowledgeListProps {
    subject: Subject | null;
}

export const KnowledgeList: React.FC<KnowledgeListProps> = ({ subject }) => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    if (!subject) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="text-6xl mb-4 grayscale opacity-30">👈</div>
                <p className="text-lg">请选择一个学科查看知识点</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{subject.icon}</span>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{subject.name}核心知识点</h2>
                        <p className="text-sm text-gray-500">共 {subject.knowledgePoints.length} 条记录</p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[600px]">
                {subject.knowledgePoints.map((point) => {
                    const isExpanded = expandedIds.has(point.id);
                    const hasDetails = point.detailedExplanation || point.studyTips || point.practiceQuestions;

                    return (
                        <div
                            key={point.id}
                            className={`p-6 transition-all duration-300 group ${hasDetails ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
                            onClick={() => hasDetails && toggleExpand(point.id)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                    {point.title}
                                    {hasDetails && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {isExpanded ? '收起' : '详情'}
                                        </span>
                                    )}
                                </h3>
                                <span className="text-xs font-mono text-gray-300">#{point.id}</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {point.description}
                            </p>

                            {/* Detailed Content */}
                            {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fadeIn">
                                    {point.detailedExplanation && (
                                        <div className="prose prose-sm prose-blue max-w-none bg-gray-50 p-4 rounded-xl">
                                            <h4 className="font-bold text-gray-900 mb-2">💡 详细解析</h4>
                                            <div className="whitespace-pre-line text-gray-700">{point.detailedExplanation}</div>
                                        </div>
                                    )}

                                    {point.studyTips && point.studyTips.length > 0 && (
                                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                            <h4 className="font-bold text-amber-800 mb-2">🎓 学习技巧</h4>
                                            <ul className="list-disc list-inside space-y-1 text-amber-700 text-sm">
                                                {point.studyTips.map((tip, idx) => (
                                                    <li key={idx}>{tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {point.practiceQuestions && point.practiceQuestions.length > 0 && (
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                            <h4 className="font-bold text-green-800 mb-2">✏️ 实战练习</h4>
                                            <div className="space-y-3">
                                                {point.practiceQuestions.map((q, idx) => (
                                                    <div key={idx} className="text-sm">
                                                        <p className="font-medium text-green-900">Q{idx + 1}: {q.question}</p>
                                                        <p className="text-green-700 pl-4 mt-1">A: {q.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {point.tags && point.tags.length > 0 && (
                                <div className="mt-3 flex gap-2">
                                    {point.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

