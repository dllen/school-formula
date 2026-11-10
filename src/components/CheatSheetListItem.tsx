import React from 'react';
import type { CheatSheet } from '../data/cheatsheets';

interface CheatSheetListItemProps {
    cheatsheet: CheatSheet;
    onClick: () => void;
}

export const CheatSheetListItem: React.FC<CheatSheetListItemProps> = ({ cheatsheet, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-sm border border-paper-3 overflow-hidden hover:shadow-md transition-colors transition-shadow cursor-pointer group"
        >
            <div className="p-6 border-b border-paper-3 bg-accent-soft group-hover:bg-accent-soft-hover transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-ink group-hover:text-accent-hover transition-colors">
                        {cheatsheet.title}
                    </h3>
                    <span className="px-3 py-1 bg-accent-soft text-accent-hover text-xs font-medium rounded-full">
                        {cheatsheet.category}
                    </span>
                </div>
                <p className="text-sm text-ink-2 line-clamp-2">
                    {cheatsheet.description}
                </p>
            </div>
            <div className="px-6 py-4 bg-paper-2/50 flex justify-between items-center">
                <span className="text-xs text-ink-3 font-medium">点击查看详情</span>
                <svg className="w-5 h-5 text-ink-3 group-hover:text-accent group-hover:translate-x-1 transition-colors transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
};
