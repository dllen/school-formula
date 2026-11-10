import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TutorialContent } from '../../data/types';
import { Icon } from '../icons/Icon';

type TutorialSectionProps = {
    content: TutorialContent;
};

export const TutorialSection: React.FC<TutorialSectionProps> = ({ content }) => {
    return (
        <section className="bg-white rounded-2xl border border-accent-soft shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 bg-accent-soft border-b border-accent-soft">
                <h3 className="flex items-center text-lg font-bold text-accent-active">
                    <Icon name="book" className="mr-2 w-5 h-5" /> 系统教程
                </h3>
            </div>

            <div className="p-6 space-y-6">
                {/* 🎯 本课目标 */}
                <div>
                    <h4 className="font-semibold text-success-ink mb-2 flex items-center">
                        <Icon name="target" className="mr-1 w-4 h-4" /> 本课目标
                    </h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        {content.objectives.map((obj: string, i: number) => (
                            <li key={i} className="text-sm text-ink-2">{obj}</li>
                        ))}
                    </ul>
                </div>

                {/* 📖 知识讲解 */}
                <div>
                    <h4 className="font-semibold text-accent-hover mb-2 flex items-center">
                        <Icon name="book-open" className="mr-1 w-4 h-4" /> 知识讲解
                    </h4>
                    <div className="prose prose-sm prose-blue max-w-none text-ink-2">
                        <ReactMarkdown>{content.explanation}</ReactMarkdown>
                    </div>
                </div>

                {/* ✏️ 例题精讲 */}
                {content.examples && content.examples.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-accent-hover mb-2 flex items-center">
                            <Icon name="pencil" className="mr-1 w-4 h-4" /> 例题精讲
                        </h4>
                        <div className="space-y-3">
                            {content.examples.map((ex, i) => (
                                <div key={i} className="p-3 bg-accent-soft/50 rounded-xl border border-accent-soft">
                                    {ex.title && <p className="font-medium text-sm text-accent-active mb-1">{ex.title}</p>}
                                    <p className="text-sm text-error">题目：{ex.problem}</p>
                                    <p className="text-sm text-success-ink mt-1">解答：{ex.solution}</p>
                                    <p className="text-xs text-ink-3 mt-1 flex items-start gap-1.5"><Icon name="idea" className="w-4 h-4 shrink-0 mt-px" />{ex.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🧩 亲子互动 */}
                {content.interaction && (
                    <div>
                        <h4 className="font-semibold text-warning-ink mb-2 flex items-center">
                            <Icon name="puzzle" className="mr-1 w-4 h-4" /> 亲子互动
                        </h4>
                        <div className="prose prose-sm prose-blue max-w-none text-ink-2">
                            <ReactMarkdown>{content.interaction}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* 📝 课后练习 */}
                {content.exercises && content.exercises.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-info-ink mb-2 flex items-center">
                            <Icon name="clipboard" className="mr-1 w-4 h-4" /> 课后练习
                        </h4>
                        <div className="space-y-2">
                            {content.exercises.map((ex, i) => (
                                <details key={i} className="group">
                                    <summary className="cursor-pointer text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                                        第 {i + 1} 题：{ex.question}
                                    </summary>
                                    <div className="ml-4 mt-1 p-2 bg-success-bg rounded-lg">
                                        <p className="text-sm text-ink flex items-start gap-1.5"><Icon name="check-circle" className="w-4 h-4 shrink-0 mt-0.5 text-success" />答案：{ex.answer}</p>
                                        {ex.explanation && <p className="text-xs text-ink-2 mt-0.5">解析：{ex.explanation}</p>}
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
