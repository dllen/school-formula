import React from 'react';
import { Icon } from '../icons/Icon';

type PracticeQuestionsProps = {
    questions: Array<{ question: string; answer: string }>;
};

export const PracticeQuestions: React.FC<PracticeQuestionsProps> = ({ questions }) => {
    if (questions.length === 0) return null;

    return (
        <div>
            <h3 className="flex items-center text-xl font-bold text-success-ink mb-4">
                <Icon name="pencil" className="mr-2 w-5 h-5" /> 实战练习
            </h3>
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div
                        key={idx}
                        className="bg-white border border-success-bg rounded-xl overflow-hidden shadow-sm"
                    >
                        <div className="bg-success-bg p-4 border-b border-success-bg">
                            <p className="font-bold text-success-ink">
                                Q{idx + 1}: {q.question}
                            </p>
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-[ink-2]">
                                <span className="font-medium text-[ink] bg-[paper-2] px-2 py-0.5 rounded mr-2">
                                    参考答案
                                </span>
                                {q.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
