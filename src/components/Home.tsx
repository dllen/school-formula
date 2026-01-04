import { useState } from 'react';
import { CheatSheetView } from './CheatSheetView';
import { ZizhiView } from './ZizhiView';
import { GradeSelector } from './GradeSelector';
import { Header } from './Header';
import { KnowledgeList } from './KnowledgeList';
import { SubjectGrid } from './SubjectGrid';
import { type GradeLevel, KNOWLEDGE_DATA, type Subject } from '../data/knowledge';

type ViewType = 'knowledge' | 'cheatsheet' | 'zizhi' | 'shiji';

export function Home() {
    const [activeView, setActiveView] = useState<ViewType>('knowledge');
    const [selectedGradeId, setSelectedGradeId] = useState<GradeLevel>('primary');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const currentGradeData = KNOWLEDGE_DATA.find(g => g.id === selectedGradeId)!;

    const handleGradeChange = (grade: GradeLevel) => {
        setSelectedGradeId(grade);
        setSelectedSubject(null); // Reset subject when grade changes
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">
            <Header activeView={activeView} onViewChange={setActiveView} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow w-full">

                {activeView === 'knowledge' ? (
                    <>
                        {/* Grade Selection Section */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">选择年级</h2>
                                <p className="text-sm text-gray-500">查看不同阶段的学科重点</p>
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
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">{currentGradeData.name}学科</h3>
                                        <p className="text-sm text-gray-500">点击卡片查看详细知识体系</p>
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
                ) : activeView === 'cheatsheet' ? (
                    <CheatSheetView />
                ) : activeView === 'zizhi' ? (
                    <ZizhiView />
                ) : (
                    <ShijiView />
                )}

            </main>

            <footer className="mt-12 py-8 text-center text-sm text-gray-400 bg-white border-t border-gray-100">
                <p>&copy; {new Date().getFullYear()} 拾艺院 (Shi Yi Yuan). All rights reserved.</p>
            </footer>
        </div>
    );
}
