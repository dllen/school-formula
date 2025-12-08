import React from 'react';

type ViewType = 'knowledge' | 'cheatsheet';

interface HeaderProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
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
                            onClick={() => onViewChange('cheatsheet')}
                            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activeView === 'cheatsheet'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            速查表
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};
