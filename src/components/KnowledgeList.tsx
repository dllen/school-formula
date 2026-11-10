import React from 'react';
import { Link } from 'react-router-dom';
import type { Subject } from '../data/knowledge';
import { Icon } from './icons/Icon';
import { iconFor } from './icons/iconFor';

interface KnowledgeListProps {
    subject: Subject | null;
}

export const KnowledgeList: React.FC<KnowledgeListProps> = ({ subject }) => {
    if (!subject) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-[ink-3] p-12 bg-[paper-2] rounded-3xl border border-dashed border-[rule]">
                <Icon name="grid" className="w-12 h-12 mb-4 text-ink-3 opacity-40" />
                <p className="text-lg">请选择一个学科查看知识点</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-[divider] overflow-hidden h-full">
            <div className="p-6 border-b border-[divider] bg-accent-soft">
                <div className="flex items-center gap-3">
                    <Icon name={iconFor(subject.icon)} className="w-8 h-8" />
                    <div>
                        <h2 className="text-2xl font-bold text-[ink]">{subject.name}核心知识点</h2>
                        <p className="text-sm text-[ink-2]">共 {subject.knowledgePoints.length} 条记录</p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-paper-3 overflow-y-auto max-h-[600px]">
                {subject.knowledgePoints.map((point) => (
                    <Link
                        key={point.id}
                        to={`/knowledge/${point.id}`}
                        className="block p-6 hover:bg-[accent-soft]/30 transition-colors transition-shadow hover:shadow-sm group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-[ink] group-hover:text-[accent] transition-colors flex items-center gap-2">
                                {point.funEmoji && <Icon name={iconFor(point.funEmoji)} className="w-5 h-5 shrink-0" />}
                                {point.title}
                                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-soft text-[accent]">
                                    详情
                                </span>
                            </h3>
                            <span className="text-xs font-mono text-rule-strong">#{point.id}</span>
                        </div>
                        <p className="text-[ink-2] leading-relaxed mb-3">
                            {point.description}
                        </p>

                        {/* 趣味内容 */}
                        {point.funFact && (
                            <div className="bg-warning-bg border border-warning-bg rounded-xl p-3 mb-2">
                                <p className="text-sm text-warning-ink">
                                    <span className="font-bold flex items-start gap-1.5"><Icon name="idea" className="w-4 h-4 shrink-0 mt-0.5" />冷知识：</span>{point.funFact}
                                </p>
                            </div>
                        )}

                        {point.funQuestion && (
                            <div className="bg-accent-soft border border-accent-soft rounded-xl p-3">
                                <p className="text-sm text-accent-active">
                                    <span className="font-bold flex items-start gap-1.5"><Icon name="search" className="w-4 h-4 shrink-0 mt-0.5" />{point.funQuestion}</span>
                                </p>
                                <p className="text-xs text-accent mt-1">点击查看详情揭晓答案 →</p>
                            </div>
                        )}

                        {point.tags && point.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {point.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-accent-soft text-[accent] text-xs rounded-full">
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
