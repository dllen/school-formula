import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SHIJI_DATA, type ShijiVolume } from '../data/shiji';

export const ShijiView: React.FC = () => {
    const [selectedVolume, setSelectedVolume] = useState<ShijiVolume | null>(SHIJI_DATA[0]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Volume List */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900">史记目录</h3>
                        <p className="text-sm text-gray-500">点击篇章开始阅读</p>
                    </div>
                    <div className="space-y-2">
                        {SHIJI_DATA.map((volume) => (
                            <button
                                key={volume.id}
                                onClick={() => setSelectedVolume(volume)}
                                className={`w-full text-left p-4 rounded-xl transition-all ${
                                    selectedVolume?.id === volume.id
                                        ? 'bg-amber-600 text-white shadow-md'
                                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                                }`}
                            >
                                <div className="font-bold">{volume.title}</div>
                                <div className={`text-sm mt-1 ${
                                    selectedVolume?.id === volume.id ? 'text-amber-100' : 'text-stone-500'
                                }`}>
                                    {volume.chapter}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Content */}
            <div className="w-full lg:w-2/3">
                {selectedVolume ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-stone-100 to-white">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedVolume.title}</h2>
                            <p className="text-stone-600 font-serif">{selectedVolume.chapter}</p>
                        </div>
                        <div className="p-8 space-y-6 bg-[#fdfbf7]">
                            {selectedVolume.content.map((paragraph, index) => (
                                <p key={index} className="text-lg text-gray-800 leading-loose text-justify font-serif tracking-wide">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        <div className="p-8 border-t border-gray-100 bg-gradient-to-r from-stone-50 to-white">
                            <h3 className="flex items-center text-xl font-bold text-stone-900 mb-6">
                                <span className="mr-2">✨</span> AI 名师解读
                            </h3>
                            <div className="prose max-w-none prose-stone">
                                <ReactMarkdown>{selectedVolume.interpretation}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ) : (
                     <div className="h-96 flex flex-col items-center justify-center text-gray-400 p-12 bg-white rounded-3xl border border-gray-100">
                        <p>请选择篇章</p>
                    </div>
                )}
            </div>
        </div>
    );
};
