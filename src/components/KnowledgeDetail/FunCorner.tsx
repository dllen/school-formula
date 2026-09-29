import React from 'react';

type FunCornerProps = {
    funFact?: string;
    funStory?: string;
    funQuestion?: string;
    funQuestionAnswer?: string;
};

export const FunCorner: React.FC<FunCornerProps> = ({
    funFact,
    funStory,
    funQuestion,
    funQuestionAnswer,
}) => {
    if (!funFact && !funStory && !funQuestion) return null;

    return (
        <div className="pt-8 border-t border-[#F0F1F2]">
            <h3 className="flex items-center text-xl font-bold text-amber-900 mb-4">
                <span className="mr-2">🌟</span> 趣味角
            </h3>
            <div className="space-y-4">
                {funFact && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <span>🧊</span> 冷知识
                        </h4>
                        <p className="text-amber-800 leading-relaxed">{funFact}</p>
                    </div>
                )}

                {funStory && (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                        <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                            <span>📖</span> 生活中的数学
                        </h4>
                        <p className="text-green-800 leading-relaxed">{funStory}</p>
                    </div>
                )}

                {funQuestion && (
                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
                        <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                            <span>❓</span> 互动问答
                        </h4>
                        <p className="text-purple-800 mb-3">{funQuestion}</p>
                        <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-800 list-none flex items-center gap-1">
                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                点击揭晓答案
                            </summary>
                            <div className="mt-3 p-3 bg-white rounded-xl border border-purple-100">
                                <p className="text-purple-700">
                                    {funQuestionAnswer || '暂无答案'}
                                </p>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
};
