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
            <div className="empty-state">
                <Icon name="grid" className="w-8 h-8" />
                <p className="text-body-s">请选择一个学科查看知识点</p>
            </div>
        );
    }

    return (
        <section aria-labelledby="knowledge-index-heading" className="min-w-0">
            <div className="index-head">
                <Icon name={iconFor(subject.icon)} className="w-5 h-5 text-ink-3" />
                <h2 id="knowledge-index-heading" className="index-title">
                    {subject.name}核心知识点
                </h2>
                <span className="index-meta">共 {subject.knowledgePoints.length} 条</span>
            </div>

            <div className="kp-scroll">
                <ul className="kp-list">
                    {subject.knowledgePoints.map((point, index) => (
                        <li key={point.id}>
                            <Link to={`/knowledge/${point.id}`} className="kp-row">
                                <span className="kp-no">{String(index + 1).padStart(2, '0')}</span>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-x-2">
                                        <h3 className="kp-title">{point.title}</h3>
                                        {point.tags
                                            ?.filter((tag) => /[\u4e00-\u9fa5]/.test(tag))
                                            .slice(0, 1)
                                            .map((tag) => (
                                                <span key={tag} className="text-caption text-ink-3">
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                    <p className="kp-desc">{point.description}</p>

                                    {point.funFact && (
                                        <p className="kp-fact">
                                            <Icon name="idea" className="w-3.5 h-3.5 kp-icon-fact" />
                                            <span>
                                                <span className="kp-fact__label">冷知识：</span>
                                                {point.funFact}
                                            </span>
                                        </p>
                                    )}

                                    {point.funQuestion && (
                                        <p className="kp-ask">
                                            <Icon name="search" className="w-3.5 h-3.5 kp-icon-ask" />
                                            <span>
                                                {point.funQuestion}
                                                <span className="kp-ask__label"> 查看详情</span>
                                            </span>
                                        </p>
                                    )}
                                </div>
                                <Icon name="chevron-right" className="w-4 h-4 kp-chevron" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
