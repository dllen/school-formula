import React from 'react';
import { Link } from 'react-router-dom';
import type { Subject } from '../data/knowledge';

interface KnowledgeListProps {
    subject: Subject | null;
}

export const KnowledgeList: React.FC<KnowledgeListProps> = ({ subject }) => {
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
                {subject.knowledgePoints.map((point) => (
                    <Link
                        key={point.id}
                        to={`/knowledge/${point.id}`}
                        className="block p-6 hover:bg-blue-50/30 transition-all hover:shadow-sm group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                {point.funEmoji && <span className="text-2xl">{point.funEmoji}</span>}
                                {point.title}
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                                    详情
                                </span>
                            </h3>
                            <span className="text-xs font-mono text-gray-300">#{point.id}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            {point.description}
                        </p>

                        {/* 趣味内容 */}
                        {point.funFact && (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-2">
                                <p className="text-sm text-amber-800">
                                    <span className="font-bold">💡 冷知识：</span>{point.funFact}
                                </p>
                            </div>
                        )}

                        {point.funQuestion && (
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                                <p className="text-sm text-purple-800">
                                    <span className="font-bold">🔍 {point.funQuestion}</span>
                                </p>
                                <p className="text-xs text-purple-500 mt-1">点击查看详情揭晓答案 →</p>
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
                    </Link>
                ))}
            </div>
        </div>
    );
};
