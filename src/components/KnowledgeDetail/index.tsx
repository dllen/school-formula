import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdUnit } from '../../ads/AdUnit';
import { AD_SLOTS, ADSENSE_CLIENT_ID, isAdConfigured } from '../../ads/config';
import { KNOWLEDGE_DATA } from '../../data/knowledge';
import { getQuestionsByKnowledgePoint } from '../../data/questions';
import { relatedKnowledgePoints } from '../../data/knowledge/related';
import { PromptModal } from '../prompts/PromptModal';
import type { KnowledgePoint, Subject } from '../../data/types';
import { Footer } from '../Footer';
import { Header as SiteHeader } from '../Header';
import { pathForView } from '../../view-routes';
import { DonatePopover } from '../DonatePopover';
import { Icon } from '../icons/Icon';
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
    const related = useMemo(() => relatedKnowledgePoints(id ?? ''), [id]);

    if (!data) {
        return (
            <div className="page-shell">
                <SiteHeader activeView="knowledge" onViewChange={(view) => navigate(pathForView(view))} />
                <main id="main" className="page-main">
                    <div className="container-page py-24">
                        <div className="empty-state">
                            <Icon name="search" className="w-8 h-8" />
                            <h1 className="text-subhead font-semibold text-ink">未找到该知识点</h1>
                            <Link to="/" className="link">返回首页</Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const { point, subject, grade } = data;
    const context = `年级：${grade.name}，学科：${subject.name}，知识点：${point.title}，描述：${point.description}`;
    const relatedQuestions = getQuestionsByKnowledgePoint(point.id);

    const hasFun = Boolean(point.funFact || point.funStory || point.funQuestion);
    const hasTutorial = Boolean(point.tutorialContent);
    const hasPractice = Boolean(point.practiceQuestions && point.practiceQuestions.length > 0);
    const hasRelated = related.length > 0;
    const hasMidAd = isAdConfigured(ADSENSE_CLIENT_ID, AD_SLOTS.knowledgeMid);
    const hasBottomAd = isAdConfigured(ADSENSE_CLIENT_ID, AD_SLOTS.knowledgeBottom);

    const toc = [
        hasTutorial && { id: 'tutorial', label: '系统教程' },
        hasPractice && { id: 'practice', label: '实战练习' },
        relatedQuestions.length > 0 && { id: 'related-practice', label: '巩固练习' },
        hasFun && { id: 'fun', label: '趣味角' },
        { id: 'ai', label: 'AI 智能助教' },
        hasRelated && { id: 'related', label: '相关知识点' },
    ].filter((item): item is { id: string; label: string } => Boolean(item));

    return (
        <div className="page-shell">
            <SiteHeader activeView="knowledge" onViewChange={(view) => navigate(pathForView(view))} />

            <main id="main" tabIndex={-1} className="page-main">
                <div className="container-page">
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-10 pb-6">
                        <nav aria-label="Breadcrumb" className="breadcrumb">
                            <Link to="/">首页</Link>
                            <span aria-hidden="true">/</span>
                            <span>{grade.name}</span>
                            <span aria-hidden="true">/</span>
                            <span>{subject.name}</span>
                        </nav>

                        <Link to="/" className="inline-flex items-center gap-1 text-label text-ink-2 hover:text-ink transition-colors">
                            <Icon name="arrow-left" className="w-4 h-4" />
                            返回列表
                        </Link>
                    </div>

                    <Header point={point} subject={subject} />

                    <div className="detail-layout">
                        <article className="min-w-0">
                            {point.tutorialContent && (
                                <TutorialSection content={point.tutorialContent} />
                            )}

                            {point.practiceQuestions && point.practiceQuestions.length > 0 && (
                                <PracticeQuestions questions={point.practiceQuestions} />
                            )}

                            {hasMidAd && (
                                <div className="section">
                                    <AdUnit placement="knowledgeMid" />
                                </div>
                            )}

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

                            {hasBottomAd && (
                                <div className="section">
                                    <AdUnit placement="knowledgeBottom" />
                                </div>
                            )}

                            {related.length > 0 && (
                                <section id="related" className="section" aria-labelledby="related-heading">
                                    <h2 id="related-heading" className="section-head">
                                        <Icon name="link" className="w-4 h-4" />
                                        相关知识点
                                    </h2>
                                    <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                                        {related.map((item) => (
                                            <li key={item.id}>
                                                <Link to={`/knowledge/${item.id}`} className="link text-body-s">
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            <div className="section flex flex-col items-center gap-2">
                                <p className="text-body-s text-ink-2">这份内容帮到你了？</p>
                                <DonatePopover triggerLabel="赞赏" triggerVariant="tag" />
                            </div>
                        </article>

                        <aside className="detail-aside">
                            <nav aria-label="本页目录">
                                <p className="text-caption font-medium text-ink-3 mb-2 px-3">本页内容</p>
                                <ul className="toc">
                                    {toc.map((item) => (
                                        <li key={item.id}>
                                            <a href={`#${item.id}`}>{item.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />

            <PromptModal
                isOpen={isPromptModalOpen}
                onClose={() => setIsPromptModalOpen(false)}
                knowledgePointTitle={point.title}
                knowledgePointGrade={grade.name}
            />
        </div>
    );
};
