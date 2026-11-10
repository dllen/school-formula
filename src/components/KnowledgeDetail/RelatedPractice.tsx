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
        <div className="pt-8 border-t border-[divider]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center text-xl font-bold text-success-ink">
                    <Icon name="pencil" className="mr-2 w-5 h-5" /> 巩固练习
                    <span className="ml-3 text-sm font-normal text-success bg-success-bg px-2 py-0.5 rounded-full">
                        {relatedCount} 道题
                    </span>
                </h3>
                <button
                    onClick={handleStartPractice}
                    className="px-6 py-2 bg-success text-white rounded-xl font-bold hover:shadow-lg hover:shadow-success-bg transition-colors transition-shadow"
                >
                    开始练习
                </button>
            </div>
        </div>
    );
};
