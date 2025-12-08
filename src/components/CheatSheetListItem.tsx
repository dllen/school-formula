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
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white group-hover:from-blue-100/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {cheatsheet.title}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {cheatsheet.category}
                    </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {cheatsheet.description}
                </p>
            </div>
            <div className="px-6 py-4 bg-gray-50/50 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">点击查看详情</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
};
