import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheatSheetView } from './CheatSheetView';
import { FormulaView } from './FormulaView';
import { MentalMathView } from './MentalMathView';
import { NotesView } from './NotesView';
import { PracticeView } from './PracticeView';
import { ShijiView } from './ShijiView';
import { AIChatView } from './AIChatView';
import { TutorialView } from './TutorialView';
import { ZizhiView } from './ZizhiView';
import { MasteryView } from './MasteryView';
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
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe: render null on server, fill year after mount
        setYear(new Date().getFullYear());
    }, []);

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

    const handleGradeChange = (grade: GradeLevel) => {
        setSelectedGradeId(grade);
        setSelectedSubject(null); // Reset subject when grade changes
    };

    return (
        <div className="min-h-screen bg-[#F5F6F7] font-sans text-slate-800 flex flex-col">
            <Header activeView={activeView} onViewChange={(view) => navigate(pathForView(view))} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow w-full">

                {activeView === 'knowledge' ? (
                    <>
                        {/* Grade Selection Section */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-[#1F2329]">选择年级</h2>
                                <p className="text-sm text-[#646A73]">查看不同阶段的学科重点</p>
                            </div>
                            <GradeSelector
                                selectedGrade={selectedGradeId}
                                onSelectGrade={handleGradeChange}
                            />
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col lg:flex-row gap-8 items-start">

                            {/* Left: Subjects */}
                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#F0F1F2]">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-[#1F2329]">{currentGradeData.name}学科</h3>
                                        <p className="text-sm text-[#646A73]">点击卡片查看详细知识体系</p>
                                    </div>
                                    <SubjectGrid
                                        subjects={currentGradeData.subjects}
                                        selectedSubjectId={selectedSubject?.id || null}
                                        onSelectSubject={setSelectedSubject}
                                    />
                                </div>
                            </div>

                            {/* Right: Knowledge Points */}
                            <div className="w-full lg:w-1/2 sticky top-24">
                                <KnowledgeList subject={selectedSubject} />
                            </div>

                        </div>
                    </>
                ) : activeView === 'tutorial' ? (
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
                ) : (
                    <ShijiView />
                )}

            </main>

            <footer className="mt-12 py-8 text-center text-sm text-[#8F959E] bg-white border-t border-[#F0F1F2]">
                <p>&copy; {year} 拾艺院 (Shi Yi Yuan). All rights reserved.</p>
            </footer>
        </div>
    );
}
