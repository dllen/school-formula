import React, { useState, useRef, useEffect } from 'react';
import { SettingsModal } from './SettingsModal';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

type ViewType = 'knowledge' | 'tutorial' | 'cheatsheet' | 'mental-math' | 'formula' | 'mastery' | 'practice' | 'notes' | 'zizhi' | 'shiji';

interface HeaderProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
}

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
                            <button
                                onClick={() => onViewChange('knowledge')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'knowledge'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                知识点
                            </button>
                            <button
                                onClick={() => onViewChange('tutorial')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'tutorial'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                教程
                            </button>
                            <button
                                onClick={() => onViewChange('cheatsheet')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'cheatsheet'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                速查表
                            </button>
                            <button
                                onClick={() => onViewChange('mental-math')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'mental-math'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                速算口诀
                            </button>
                            <button
                                onClick={() => onViewChange('formula')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'formula'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                公式宝典
                            </button>
                            <button
                                onClick={() => onViewChange('mastery')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'mastery'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                融会贯通
                            </button>
                            <button
                                onClick={() => onViewChange('practice')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'practice'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                专题练习
                            </button>
                            <button
                                onClick={() => onViewChange('notes')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'notes'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                学习笔记
                            </button>
                            <button
                                onClick={() => onViewChange('zizhi')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'zizhi'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                资治通鉴
                            </button>
                            <button
                                onClick={() => onViewChange('shiji')}
                                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'shiji'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                史记
                            </button>
                        </nav>

                        {/* 登录入口 / 用户菜单 */}
                        {isAuthenticated && user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen((o) => !o)}
                                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    title={user.email}
                                >
                                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold uppercase">
                                        {(user.nickname || user.email || 'U').charAt(0)}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:inline">
                                        {user.nickname || user.email}
                                    </span>
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
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </header>
    );
};
