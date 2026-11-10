import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheatSheetView } from './CheatSheetView';
import { FormulaView } from './FormulaView';
import { MentalMathView } from './MentalMathView';
import { NotesView } from './NotesView';
import { PracticeView } from './PracticeView';
import { ShijiView } from './ShijiView';
import { AIChatView } from './AIChatView';
import { PoetryView } from './poetry/PoetryView';
import { TutorialView } from './TutorialView';
import { ZizhiView } from './ZizhiView';
import { MasteryView } from './MasteryView';
import { Footer } from './Footer';
import { GradeSelector } from './GradeSelector';
import { Header } from './Header';
import { KnowledgeList } from './KnowledgeList';
import { SubjectGrid } from './SubjectGrid';
import { type GradeLevel, KNOWLEDGE_DATA, type Subject } from '../data/knowledge';
import type { ViewType } from './Header/types';
import { isViewName, pathForView, viewFromPath } from '../view-routes';

export function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedGradeId, setSelectedGradeId] = useState<GradeLevel>('primary');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
        KNOWLEDGE_DATA[0]?.subjects[0] ?? null,
    );

    const activeView: ViewType = viewFromPath(location.pathname) ?? 'knowledge';

    // 旧链接 ?view=xxx 兼容：重定向到 /<view>，保留其余 query（如 kp）
    useEffect(() => {
        if (location.pathname !== '/') return;
        const view = searchParams.get('view');
        if (view && isViewName(view) && view !== 'knowledge') {
            const rest = new URLSearchParams(searchParams);
            rest.delete('view');
            const search = rest.toString();
            navigate({ pathname: pathForView(view), search: search ? `?${search}` : '' }, { replace: true });
        }
    }, [location.pathname, searchParams, navigate]);

    const currentGradeData = KNOWLEDGE_DATA.find(g => g.id === selectedGradeId)!;
    const totalPoints = currentGradeData.subjects.reduce(
        (sum, subject) => sum + subject.knowledgePoints.length,
        0,
    );

    const handleGradeChange = (grade: GradeLevel) => {
        setSelectedGradeId(grade);
        const nextGrade = KNOWLEDGE_DATA.find(g => g.id === grade);
        setSelectedSubject(nextGrade?.subjects[0] ?? null); // Reset subject to new grade's first subject
    };

    return (
        <div className="page-shell">
            <Header activeView={activeView} onViewChange={(view) => navigate(pathForView(view))} />

            <main id="main" tabIndex={-1} className="page-main">
                {activeView === 'knowledge' ? (
                    <div className="container-page pt-10">
                        <div className="page-head">
                            <div className="page-head__text">
                                <h1 className="page-title">知识点</h1>
                                <p className="page-lead">
                                    {currentGradeData.name}，{currentGradeData.subjects.length} 个学科，
                                    {totalPoints} 个知识点
                                </p>
                            </div>
                        </div>

                        <div className="browse">
                            <aside className="browse__rail" aria-label="学科导航">
                                <GradeSelector
                                    selectedGrade={selectedGradeId}
                                    onSelectGrade={handleGradeChange}
                                />
                                <SubjectGrid
                                    subjects={currentGradeData.subjects}
                                    selectedSubjectId={selectedSubject?.id || null}
                                    onSelectSubject={setSelectedSubject}
                                />
                            </aside>

                            <KnowledgeList subject={selectedSubject} />
                        </div>
                    </div>
                ) : (
                    <div className="container-page pt-10 pb-8">
                        {activeView === 'tutorial' ? (
                            <TutorialView />
                        ) : activeView === 'cheatsheet' ? (
                            <CheatSheetView />
                        ) : activeView === 'mental-math' ? (
                            <MentalMathView />
                        ) : activeView === 'formula' ? (
                            <FormulaView />
                        ) : activeView === 'mastery' ? (
                            <MasteryView />
                        ) : activeView === 'practice' ? (
                            <PracticeView />
                        ) : activeView === 'notes' ? (
                            <NotesView />
                        ) : activeView === 'zizhi' ? (
                            <ZizhiView />
                        ) : activeView === 'ai-chat' ? (
                            <AIChatView />
                        ) : activeView === 'poetry' ? (
                            <PoetryView />
                        ) : (
                            <ShijiView />
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
