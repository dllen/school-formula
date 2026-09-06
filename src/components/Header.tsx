import React, { useState, useRef, useEffect } from 'react';
import { SettingsModal } from './SettingsModal';
import { useAuth } from '../context/auth-context';
import { AuthModal } from './AuthModal';

type ViewType = 'knowledge' | 'tutorial' | 'cheatsheet' | 'mental-math' | 'formula' | 'mastery' | 'practice' | 'notes' | 'zizhi' | 'shiji';

interface HeaderProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
}

const NAV_GROUPS: { label: string; views: { value: ViewType; label: string }[] }[] = [
    {
        label: '学科学习',
        views: [
            { value: 'knowledge', label: '知识点' },
            { value: 'formula', label: '公式宝典' },
            { value: 'mental-math', label: '速算口诀' },
            { value: 'tutorial', label: '教程' },
        ],
    },
    {
        label: '工具速查',
        views: [
            { value: 'cheatsheet', label: '速查表' },
            { value: 'practice', label: '专题练习' },
            { value: 'mastery', label: '融会贯通' },
            { value: 'notes', label: '学习笔记' },
        ],
    },
    {
        label: '古籍阅读',
        views: [
            { value: 'zizhi', label: '资治通鉴' },
            { value: 'shiji', label: '史记' },
        ],
    },
];

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // 点击菜单外部关闭用户下拉
    useEffect(() => {
        if (!isUserMenuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isUserMenuOpen]);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                            <span className="text-xl font-bold">拾</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            拾艺院 <span className="text-sm font-normal text-gray-500 ml-2 hidden sm:inline">核心知识点库</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            {NAV_GROUPS.map((group) => (
                                <div key={group.label} className="relative group">
                                    <button
                                        className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${group.views.some(v => v.value === activeView)
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {group.label}
                                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        {group.views.map((view) => (
                                            <button
                                                key={view.value}
                                                onClick={() => onViewChange(view.value)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeView === view.value
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {view.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {/* 登录入口 / 用户菜单 */}
                        {isAuthenticated && user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen((o) => !o)}
                                    className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    title={user.nickname || user.email}
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.nickname || user.email || 'avatar'}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold uppercase">
                                            {(user.nickname || user.email || 'U').charAt(0)}
                                        </span>
                                    )}
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user.nickname || user.email}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            退出登录
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthOpen(true)}
                                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                登录
                            </button>
                        )}

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="AI 设置"
                        >
                            ⚙️
                        </button>
                    </div>
                </div>
            </div>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />}
        </header>
    );
};
