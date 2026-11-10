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
        <section id="fun" className="section">
            <h2 className="section-head">
                <Icon name="sparkle" className="h-5 w-5" />
                趣味角
            </h2>
            <div className="mt-6 space-y-3">
                {funFact && (
                    <div className="well bg-warning-bg">
                        <h3 className="flex items-center gap-2 text-title font-semibold text-warning-ink">
                            <Icon name="idea" className="h-4 w-4" />
                            冷知识
                        </h3>
                        <p className="mt-2 max-w-prose text-body text-warning-ink">{funFact}</p>
                    </div>
                )}

                {funStory && (
                    <div className="well bg-success-bg">
                        <h3 className="flex items-center gap-2 text-title font-semibold text-success-ink">
                            <Icon name="book-open" className="h-4 w-4" />
                            生活中的数学
                        </h3>
                        <p className="mt-2 max-w-prose text-body text-success-ink">{funStory}</p>
                    </div>
                )}

                {funQuestion && (
                    <div className="well bg-accent-soft">
                        <h3 className="flex items-center gap-2 text-title font-semibold text-accent-active">
                            <Icon name="dialogue" className="h-4 w-4" />
                            互动问答
                        </h3>
                        <p className="mt-2 max-w-prose text-body text-accent-active">{funQuestion}</p>
                        <details className="group mt-3">
                            <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 text-body-s font-medium text-accent-active transition-colors hover:text-accent-hover">
                                <Icon
                                    name="grid"
                                    className="h-3 w-3 transition-transform group-open:rotate-90"
                                />
                                点击揭晓答案
                            </summary>
                            <p className="mt-2 max-w-prose text-body-s text-accent-hover">
                                {funQuestionAnswer || '暂无答案'}
                            </p>
                        </details>
                    </div>
                )}
            </div>
        </section>
    );
};
