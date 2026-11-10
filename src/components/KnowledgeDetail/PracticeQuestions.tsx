import React from 'react';
import { Icon } from '../icons/Icon';

type PracticeQuestionsProps = {
    questions: Array<{ question: string; answer: string }>;
};

export const PracticeQuestions: React.FC<PracticeQuestionsProps> = ({ questions }) => {
    if (questions.length === 0) return null;

    return (
        <section id="practice" className="section">
            <h2 className="section-head">
                <Icon name="pencil" className="h-5 w-5" />
                实战练习
            </h2>
            <ol className="mt-6 space-y-3">
                {questions.map((q, idx) => (
                    <li key={idx} className="well">
                        <p className="text-body text-ink">
                            <span className="mr-2 font-semibold text-ink-3">Q{idx + 1}</span>
                            {q.question}
                        </p>
                        <p className="mt-2 border-t border-divider pt-2 text-body-s text-ink-2">
                            <span className="mr-2 font-medium text-ink">参考答案</span>
                            {q.answer}
                        </p>
                    </li>
                ))}
            </ol>
        </section>
    );
};
