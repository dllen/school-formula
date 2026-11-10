import React from 'react';
import type { CheatSheet } from '../data/cheatsheets';

interface CheatSheetListItemProps {
    cheatsheet: CheatSheet;
    onClick: () => void;
}

/**
 * 速查表索引里的一行：标题在前，说明一行，右侧一枚安静的箭头。
 * 行与行之间只用一条 1px 分隔线，不重复卡片、不重复分类标签。
 */
export const CheatSheetListItem: React.FC<CheatSheetListItemProps> = ({ cheatsheet, onClick }) => {
    return (
        <li className="border-b border-divider">
            <button
                type="button"
                onClick={onClick}
                className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-4 rounded-md px-2 py-3 text-left transition-colors hover:bg-paper-2"
            >
                <span className="min-w-0">
                    <span className="block text-title font-semibold text-ink">{cheatsheet.title}</span>
                    <span className="mt-0.5 block text-body-s text-ink-2">{cheatsheet.description}</span>
                </span>
                <span
                    aria-hidden="true"
                    className="h-2 w-2 justify-self-end rotate-45 border-t border-r border-rule-strong"
                />
            </button>
        </li>
    );
};
