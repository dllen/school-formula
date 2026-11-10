import React, { useMemo, useState } from 'react';
import { getCheatSheetsByGrade, type CheatSheet } from '../data/cheatsheets';
import type { GradeLevel } from '../data/knowledge';
import { CheatSheetCard } from './CheatSheetCard';
import { CheatSheetListItem } from './CheatSheetListItem';
import { GradeSelector } from './GradeSelector';
import { Icon } from './icons/Icon';

/**
 * 速查表是一份索引：分类是分组标题，条目是按行排列的目录。
 * 选中一条后换成详情页，详情页自己带打印动作。
 */
export const CheatSheetView: React.FC = () => {
    const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('primary');
    const [selectedSheet, setSelectedSheet] = useState<CheatSheet | null>(null);

    // Reset selection when grade changes
    const handleGradeChange = (grade: GradeLevel) => {
        setSelectedGrade(grade);
        setSelectedSheet(null);
    };

    const groups = useMemo(() => {
        const byCategory = new Map<string, CheatSheet[]>();
        getCheatSheetsByGrade(selectedGrade).forEach((sheet) => {
            const bucket = byCategory.get(sheet.category);
            if (bucket) bucket.push(sheet);
            else byCategory.set(sheet.category, [sheet]);
        });
        return Array.from(byCategory, ([category, sheets]) => ({ category, sheets }));
    }, [selectedGrade]);

    if (selectedSheet) {
        return (
            <div>
                <button
                    type="button"
                    onClick={() => setSelectedSheet(null)}
                    className="btn btn-ghost -ml-2"
                >
                    返回列表
                </button>
                <CheatSheetCard cheatsheet={selectedSheet} />
            </div>
        );
    }

    return (
        <div>
            <div className="page-head">
                <div className="page-head__text">
                    <h1 className="page-title">速查表</h1>
                    <p className="page-lead">快速查看和打印各学科重点记忆表格</p>
                </div>
                <GradeSelector
                    selectedGrade={selectedGrade}
                    onSelectGrade={handleGradeChange}
                />
            </div>

            {groups.length > 0 ? (
                <div className="flex flex-col gap-10">
                    {groups.map(({ category, sheets }) => (
                        <section key={category}>
                            <div className="flex items-baseline gap-3">
                                <h2 className="text-subhead font-semibold text-ink">{category}</h2>
                                <span className="h-px flex-1 bg-divider" aria-hidden="true" />
                                <span className="tabular text-caption text-ink-3">{sheets.length} 份</span>
                            </div>
                            <ul>
                                {sheets.map((sheet) => (
                                    <CheatSheetListItem
                                        key={sheet.id}
                                        cheatsheet={sheet}
                                        onClick={() => setSelectedSheet(sheet)}
                                    />
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Icon name="clipboard" className="h-10 w-10 text-ink-3" />
                    <p className="text-body-s text-ink-2">该年级暂无速查表</p>
                </div>
            )}
        </div>
    );
};
