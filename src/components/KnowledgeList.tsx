import React from 'react';
import { Link } from 'react-router-dom';
import type { Subject } from '../data/knowledge';

interface KnowledgeListProps {
    subject: Subject | null;
}

export const KnowledgeList: React.FC<KnowledgeListProps> = ({ subject }) => {
    if (!subject) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-[#8F959E] p-12 bg-[#F5F6F7] rounded-3xl border border-dashed border-[#E5E6EB]">
                <div className="text-6xl mb-4 grayscale opacity-30">👈</div>
                <p className="text-lg">请选择一个学科查看知识点</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0F1F2] overflow-hidden h-full">
            <div className="p-6 border-b border-[#F0F1F2] bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{subject.icon}</span>
                    <div>
                        <h2 className="text-2xl font-bold text-[#1F2329]">{subject.name}核心知识点</h2>
                        <p className="text-sm text-[#646A73]">共 {subject.knowledgePoints.length} 条记录</p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[600px]">
                {subject.knowledgePoints.map((point) => (
                    <Link
                        key={point.id}
                        to={`/knowledge/${point.id}`}
                        className="block p-6 hover:bg-[#E1EAFF]/30 transition-all hover:shadow-sm group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-[#1F2329] group-hover:text-[#3370FF] transition-colors flex items-center gap-2">
                                {point.funEmoji && <span className="text-2xl">{point.funEmoji}</span>}
                                {point.title}
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-[#3370FF]">
                                    详情
                                </span>
                            </h3>
                            <span className="text-xs font-mono text-gray-300">#{point.id}</span>
                        </div>
                        <p className="text-[#646A73] leading-relaxed mb-3">
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
                                    <span key={tag} className="px-2 py-0.5 bg-blue-100 text-[#3370FF] text-xs rounded-full">
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
