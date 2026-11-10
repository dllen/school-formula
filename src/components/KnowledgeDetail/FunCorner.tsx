import React from 'react';
import { Icon } from '../icons/Icon';

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
        <div className="pt-8 border-t border-[divider]">
            <h3 className="flex items-center text-xl font-bold text-warning-ink mb-4">
                <Icon name="sparkle" className="mr-2 w-5 h-5" /> 趣味角
            </h3>
            <div className="space-y-4">
                {funFact && (
                    <div className="bg-warning-bg border border-warning-bg rounded-2xl p-5">
                        <h4 className="font-bold text-warning-ink mb-2 flex items-center gap-2">
                            <Icon name="idea" className="w-4 h-4" /> 冷知识
                        </h4>
                        <p className="text-warning-ink leading-relaxed">{funFact}</p>
                    </div>
                )}

                {funStory && (
                    <div className="bg-success-bg border border-success-bg rounded-2xl p-5">
                        <h4 className="font-bold text-success-ink mb-2 flex items-center gap-2">
                            <Icon name="book-open" className="w-4 h-4" /> 生活中的数学
                        </h4>
                        <p className="text-success-ink leading-relaxed">{funStory}</p>
                    </div>
                )}

                {funQuestion && (
                    <div className="bg-accent-soft border border-accent-soft rounded-2xl p-5">
                        <h4 className="font-bold text-accent-active mb-2 flex items-center gap-2">
                            <Icon name="dialogue" className="w-4 h-4" /> 互动问答
                        </h4>
                        <p className="text-accent-active mb-3">{funQuestion}</p>
                        <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-accent hover:text-accent-active list-none flex items-center gap-1">
                                <Icon name="grid" className="w-3 h-3 group-open:rotate-90 transition-transform" />
                                点击揭晓答案
                            </summary>
                            <div className="mt-3 p-3 bg-white rounded-xl border border-accent-soft">
                                <p className="text-accent-hover">
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
