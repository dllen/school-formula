import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../icons/Icon';

type RelatedPracticeProps = {
    pointId: string;
    relatedCount: number;
};

export const RelatedPractice: React.FC<RelatedPracticeProps> = ({
    pointId,
    relatedCount,
}) => {
    const navigate = useNavigate();

    if (relatedCount === 0) return null;

    const handleStartPractice = () => {
        navigate(`/practice?kp=${pointId}`);
    };

    return (
        <section id="related-practice" className="section">
            <div className="well flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="section-head">
                        <Icon name="target" className="h-5 w-5" />
                        巩固练习
                        <span className="section-head__meta">{relatedCount} 道题</span>
                    </h2>
                    <p className="section-note">用本知识点的题目巩固。</p>
                </div>
                <button type="button" className="btn btn-secondary shrink-0" onClick={handleStartPractice}>
                    开始练习
                </button>
            </div>
        </section>
    );
};
