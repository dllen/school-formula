import React from 'react';

export const Header: React.FC = () => {
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
                    <nav>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 text-sm font-medium">关于我们</a>
                    </nav>
                </div>
            </div>
        </header>
    );
};
