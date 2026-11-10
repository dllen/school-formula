import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SHIJI_DATA, type ShijiVolume } from '../data/shiji';
import { Icon } from './icons/Icon';

export const ShijiView: React.FC = () => {
    const [selectedVolume, setSelectedVolume] = useState<ShijiVolume | null>(SHIJI_DATA[0]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Volume List */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white p-6 rounded-[12px] shadow-sm border border-[divider]">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[ink]">史记目录</h3>
                        <p className="text-sm text-[ink-2]">点击篇章开始阅读</p>
                    </div>
                    <div className="space-y-2">
                        {SHIJI_DATA.map((volume) => (
                            <button
                                key={volume.id}
                                onClick={() => setSelectedVolume(volume)}
                                className={`w-full text-left p-4 rounded-xl transition-colors ${
                                    selectedVolume?.id === volume.id
                                        ? 'bg-warning text-white shadow-md'
                                        : 'bg-paper-2 text-ink-2 hover:bg-paper-3'
                                }`}
                            >
                                <div className="font-bold">{volume.title}</div>
                                <div className={`text-sm mt-1 ${
                                    selectedVolume?.id === volume.id ? 'text-warning-bg' : 'text-ink-3'
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
                    <div className="bg-white rounded-[12px] shadow-sm border border-[divider] overflow-hidden">
                        <div className="p-8 border-b border-[divider] bg-paper-3">
                            <h2 className="text-2xl font-bold text-[ink] mb-2">{selectedVolume.title}</h2>
                            <p className="text-ink-2 font-serif">{selectedVolume.chapter}</p>
                        </div>
                        <div className="p-8 space-y-6 bg-paper-2">
                            {selectedVolume.content.map((paragraph, index) => (
                                <p key={index} className="text-lg text-ink leading-loose font-serif tracking-wide">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        <div className="p-8 border-t border-[divider] bg-paper-2">
                            <h3 className="flex items-center text-xl font-bold text-ink mb-6">
                                <Icon name="sparkle" className="mr-2 w-5 h-5" /> AI 名师解读
                            </h3>
                            <div className="prose max-w-none prose-stone">
                                <ReactMarkdown>{selectedVolume.interpretation}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ) : (
                     <div className="h-96 flex flex-col items-center justify-center text-[ink-3] p-12 bg-white rounded-[12px] border border-[divider]">
                        <p>请选择篇章</p>
                    </div>
                )}
            </div>
        </div>
    );
};
