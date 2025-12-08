import React, { useState } from 'react';
import { getCheatSheetsByGrade } from '../data/cheatsheets';
import type { GradeLevel } from '../data/knowledge';
import { CheatSheetCard } from './CheatSheetCard';
import { GradeSelector } from './GradeSelector';

export const CheatSheetView: React.FC = () => {
    const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('primary');
    const cheatsheets = getCheatSheetsByGrade(selectedGrade);

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
                    onSelectGrade={setSelectedGrade}
                />
            </div>

            {/* CheatSheets Grid */}
            {cheatsheets.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cheatsheets.map(sheet => (
                        <CheatSheetCard key={sheet.id} cheatsheet={sheet} />
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
