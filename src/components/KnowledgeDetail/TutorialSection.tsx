import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TutorialContent } from '../../data/types';

type TutorialSectionProps = {
    content: TutorialContent;
};

export const TutorialSection: React.FC<TutorialSectionProps> = ({ content }) => {
    return (
        <section className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100">
                <h3 className="flex items-center text-lg font-bold text-indigo-800">
                    <span className="mr-2">📚</span> 系统教程
                </h3>
            </div>

            <div className="p-6 space-y-6">
                {/* 🎯 本课目标 */}
                <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                        <span className="mr-1">🎯</span> 本课目标
                    </h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        {content.objectives.map((obj: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700">{obj}</li>
                        ))}
                    </ul>
                </div>

                {/* 📖 知识讲解 */}
                <div>
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                        <span className="mr-1">📖</span> 知识讲解
                    </h4>
                    <div className="prose prose-sm prose-blue max-w-none text-gray-700">
                        <ReactMarkdown>{content.explanation}</ReactMarkdown>
                    </div>
                </div>

                {/* ✏️ 例题精讲 */}
                {content.examples && content.examples.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-purple-700 mb-2 flex items-center">
                            <span className="mr-1">✏️</span> 例题精讲
                        </h4>
                        <div className="space-y-3">
                            {content.examples.map((ex, i) => (
                                <div key={i} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    {ex.title && <p className="font-medium text-sm text-purple-900 mb-1">{ex.title}</p>}
                                    <p className="text-sm text-rose-600">题目：{ex.problem}</p>
                                    <p className="text-sm text-emerald-700 mt-1">解答：{ex.solution}</p>
                                    <p className="text-xs text-gray-500 mt-1">💡 {ex.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🧩 亲子互动 */}
                {content.interaction && (
                    <div>
                        <h4 className="font-semibold text-amber-700 mb-2 flex items-center">
                            <span className="mr-1">🧩</span> 亲子互动
                        </h4>
                        <div className="prose prose-sm prose-blue max-w-none text-gray-700">
                            <ReactMarkdown>{content.interaction}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* 📝 课后练习 */}
                {content.exercises && content.exercises.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-cyan-700 mb-2 flex items-center">
                            <span className="mr-1">📝</span> 课后练习
                        </h4>
                        <div className="space-y-2">
                            {content.exercises.map((ex, i) => (
                                <details key={i} className="group">
                                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                                        第 {i + 1} 题：{ex.question}
                                    </summary>
                                    <div className="ml-4 mt-1 p-2 bg-emerald-50 rounded-lg">
                                        <p className="text-sm text-gray-800">✅ 答案：{ex.answer}</p>
                                        {ex.explanation && <p className="text-xs text-gray-600 mt-0.5">解析：{ex.explanation}</p>}
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
