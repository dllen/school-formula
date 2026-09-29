import React from 'react';

type RelatedPracticeProps = {
    pointId: string;
    relatedCount: number;
};

export const RelatedPractice: React.FC<RelatedPracticeProps> = ({
    pointId,
    relatedCount,
}) => {
    if (relatedCount === 0) return null;

    const handleStartPractice = () => {
        const params = new URLSearchParams({ view: 'practice', kp: pointId });
        window.location.href = `/?${params.toString()}`;
    };

    return (
        <div className="pt-8 border-t border-[#F0F1F2]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center text-xl font-bold text-green-900">
                    <span className="mr-2">✏️</span> 巩固练习
                    <span className="ml-3 text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {relatedCount} 道题
                    </span>
                </h3>
                <button
                    onClick={handleStartPractice}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all"
                >
                    开始练习
                </button>
            </div>
        </div>
    );
};
