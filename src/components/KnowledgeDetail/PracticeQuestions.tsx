import React from 'react';

type PracticeQuestionsProps = {
    questions: Array<{ question: string; answer: string }>;
};

export const PracticeQuestions: React.FC<PracticeQuestionsProps> = ({ questions }) => {
    if (questions.length === 0) return null;

    return (
        <div>
            <h3 className="flex items-center text-xl font-bold text-green-900 mb-4">
                <span className="mr-2">✏️</span> 实战练习
            </h3>
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div
                        key={idx}
                        className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm"
                    >
                        <div className="bg-green-50 p-4 border-b border-green-100">
                            <p className="font-bold text-green-900">
                                Q{idx + 1}: {q.question}
                            </p>
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-[#646A73]">
                                <span className="font-medium text-[#1F2329] bg-[#F5F6F7] px-2 py-0.5 rounded mr-2">
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
