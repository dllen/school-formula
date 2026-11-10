import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TutorialContent } from '../../data/types';
import { Icon } from '../icons/Icon';

type TutorialSectionProps = {
    content: TutorialContent;
};

export const TutorialSection: React.FC<TutorialSectionProps> = ({ content }) => {
    return (
        <section id="tutorial" className="section">
            <h2 className="section-head">
                <Icon name="book" className="h-5 w-5" />
                系统教程
            </h2>

            <div className="mt-6 space-y-8">
                <div>
                    <h3 className="flex items-center gap-2 text-title font-semibold text-ink">
                        <Icon name="target" className="h-4 w-4 text-ink-3" />
                        本课目标
                    </h3>
                    <ul className="mt-3 max-w-prose list-disc space-y-1.5 pl-5 text-body text-ink-2 marker:text-ink-3">
                        {content.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="flex items-center gap-2 text-title font-semibold text-ink">
                        <Icon name="book-open" className="h-4 w-4 text-ink-3" />
                        知识讲解
                    </h3>
                    <div className="prose-body mt-3">
                        <ReactMarkdown>{content.explanation}</ReactMarkdown>
                    </div>
                </div>

                {content.examples && content.examples.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 text-title font-semibold text-ink">
                            <Icon name="pencil" className="h-4 w-4 text-ink-3" />
                            例题精讲
                        </h3>
                        <div className="mt-3 space-y-3">
                            {content.examples.map((ex, i) => (
                                <article key={i} className="well">
                                    {ex.title && (
                                        <div className="flex items-center gap-2">
                                            <Icon name="pencil" className="h-4 w-4 text-ink-3" />
                                            <h4 className="text-title font-semibold text-ink">{ex.title}</h4>
                                        </div>
                                    )}
                                    <div className="mt-2 space-y-1.5 text-body-s">
                                        <p className="text-ink-2">
                                            <span className="font-medium text-ink">题目：</span>
                                            {ex.problem}
                                        </p>
                                        <p className="text-ink-2">
                                            <span className="font-medium text-ink">解答：</span>
                                            {ex.solution}
                                        </p>
                                        <p className="flex items-start gap-2 text-ink-3">
                                            <Icon name="idea" className="mt-0.5 h-4 w-4 shrink-0" />
                                            {ex.tip}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {content.interaction && (
                    <div>
                        <h3 className="flex items-center gap-2 text-title font-semibold text-ink">
                            <Icon name="puzzle" className="h-4 w-4 text-ink-3" />
                            亲子互动
                        </h3>
                        <div className="prose-body mt-3">
                            <ReactMarkdown>{content.interaction}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {content.exercises && content.exercises.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 text-title font-semibold text-ink">
                            <Icon name="clipboard" className="h-4 w-4 text-ink-3" />
                            课后练习
                        </h3>
                        <div className="mt-3 divide-y divide-divider">
                            {content.exercises.map((ex, i) => (
                                <details key={i} className="group py-3 first:pt-0 last:pb-0">
                                    <summary className="list-none cursor-pointer text-body-s font-medium text-ink-2 transition-colors hover:text-ink">
                                        <span className="inline-flex items-start gap-2">
                                            <Icon
                                                name="grid"
                                                className="mt-0.5 h-4 w-4 shrink-0 text-ink-3 transition-transform group-open:rotate-90"
                                            />
                                            第 {i + 1} 题：{ex.question}
                                        </span>
                                    </summary>
                                    <div className="well mt-3">
                                        <p className="flex items-start gap-2 text-body-s text-ink">
                                            <Icon name="check-circle" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                            <span>答案：{ex.answer}</span>
                                        </p>
                                        {ex.explanation && (
                                            <p className="mt-1 pl-6 text-body-s text-ink-2">解析：{ex.explanation}</p>
                                        )}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
