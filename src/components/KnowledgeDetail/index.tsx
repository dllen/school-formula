import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdUnit } from '../../ads/AdUnit';
import { KNOWLEDGE_DATA } from '../../data/knowledge';
import { getQuestionsByKnowledgePoint } from '../../data/questions';
import { PromptModal } from '../prompts/PromptModal';
import type { KnowledgePoint, Subject } from '../../data/types';
import { AIGenerator } from './AIGenerator';
import { FunCorner } from './FunCorner';
import { Header } from './Header';
import { PracticeQuestions } from './PracticeQuestions';
import { RelatedPractice } from './RelatedPractice';
import { TutorialSection } from './TutorialSection';

type KnowledgeDetailData = {
    point: KnowledgePoint;
    subject: Subject;
    grade: { name: string };
};

const findKnowledgePoint = (pointId: string | undefined): KnowledgeDetailData | null => {
    if (!pointId) return null;
    for (const grade of KNOWLEDGE_DATA) {
        for (const subject of grade.subjects) {
            const point = subject.knowledgePoints.find(p => p.id === pointId);
            if (point) return { point, subject, grade };
        }
    }
    return null;
};

export const KnowledgeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    const data = useMemo(() => findKnowledgePoint(id), [id]);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F6F7]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#1F2329] mb-4">未找到该知识点</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#3370FF] hover:text-blue-800 font-medium"
                    >
                        返回首页
                    </button>
                </div>
            </div>
        );
    }

    const { point, subject, grade } = data;
    const context = `年级：${grade.name}，学科：${subject.name}，知识点：${point.title}，描述：${point.description}`;
    const relatedQuestions = getQuestionsByKnowledgePoint(point.id);

    return (
        <div className="min-h-screen bg-[#F5F6F7] font-sans text-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center text-[#646A73] hover:text-[#3370FF] transition-colors"
                    aria-label="返回首页"
                >
                    <span className="mr-2">←</span> 返回列表
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-[#F0F1F2] overflow-hidden">
                    <Header point={point} subject={subject} />
                    <div className="p-8 space-y-8">
                        {point.tutorialContent && (
                            <TutorialSection content={point.tutorialContent} />
                        )}
                        {point.practiceQuestions && point.practiceQuestions.length > 0 && (
                            <PracticeQuestions questions={point.practiceQuestions} />
                        )}
                        <AdUnit placement="knowledgeMid" />
                        {relatedQuestions.length > 0 && (
                            <RelatedPractice
                                pointId={point.id}
                                relatedCount={relatedQuestions.length}
                            />
                        )}
                        <FunCorner
                            funFact={point.funFact}
                            funStory={point.funStory}
                            funQuestion={point.funQuestion}
                            funQuestionAnswer={point.funQuestionAnswer}
                        />
                        <AIGenerator
                            topic={point.title}
                            context={context}
                            knowledgePointTitle={point.title}
                            knowledgePointGrade={grade.name}
                            onPromptModalOpen={() => setIsPromptModalOpen(true)}
                        />
                        <AdUnit placement="knowledgeBottom" />
                    </div>
                </div>
            </div>
            <PromptModal
                isOpen={isPromptModalOpen}
                onClose={() => setIsPromptModalOpen(false)}
                knowledgePointTitle={point.title}
                knowledgePointGrade={grade.name}
            />
        </div>
    );
};
