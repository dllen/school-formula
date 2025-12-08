import React, { useState } from 'react';
import { getCheatSheetsByGrade, type CheatSheet } from '../data/cheatsheets';
import type { GradeLevel } from '../data/knowledge';
import { CheatSheetCard } from './CheatSheetCard';
import { CheatSheetListItem } from './CheatSheetListItem';
import { GradeSelector } from './GradeSelector';

export const CheatSheetView: React.FC = () => {
    const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('primary');
    const [selectedSheet, setSelectedSheet] = useState<CheatSheet | null>(null);

    // Reset selection when grade changes
    const handleGradeChange = (grade: GradeLevel) => {
        setSelectedGrade(grade);
        setSelectedSheet(null);
    };

    const cheatsheets = getCheatSheetsByGrade(selectedGrade);

    if (selectedSheet) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedSheet(null)}
                    className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回列表
                </button>
                <CheatSheetCard cheatsheet={selectedSheet} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">速查表</h2>
                    <p className="text-sm text-gray-500">快速查看和打印各学科重点记忆表格</p>
                </div>
                <GradeSelector
                    selectedGrade={selectedGrade}
                    onSelectGrade={handleGradeChange}
                />
            </div>

            {/* CheatSheets Grid */}
            {cheatsheets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cheatsheets.map(sheet => (
                        <CheatSheetListItem
                            key={sheet.id}
                            cheatsheet={sheet}
                            onClick={() => setSelectedSheet(sheet)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <div className="text-6xl mb-4 grayscale opacity-30">📋</div>
                    <p className="text-lg text-gray-400">该年级暂无速查表</p>
                </div>
            )}
        </div>
    );
};
