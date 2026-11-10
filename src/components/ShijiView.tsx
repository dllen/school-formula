import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { stripHeadingEmoji } from '../utils/markdown';
import { SHIJI_DATA, type ShijiVolume } from '../data/shiji';
import { Icon } from './icons/Icon';

const SHIJI_TOTAL = SHIJI_DATA.length;

/**
 * 史记：目录是左侧 15rem 的栏，正文是右侧的阅读列。
 * 栏里每篇一行、发丝线相隔；选中的一行落在纸面上，字用强调色。
 */
export const ShijiView: React.FC = () => {
    const [selectedVolume, setSelectedVolume] = useState<ShijiVolume | null>(SHIJI_DATA[0]);

    return (
        <>
            <div className="page-head">
                <div className="page-head__text">
                    <h1 className="page-title">史记</h1>
                    <p className="page-lead">点击篇章开始阅读</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
                <div className="lg:hidden">
                    <label className="field">
                        <span className="field__label">选择篇章</span>
                        <select
                            className="input"
                            value={selectedVolume?.id ?? ''}
                            onChange={(event) => {
                                const next = SHIJI_DATA.find((volume) => volume.id === event.target.value);
                                setSelectedVolume(next ?? null);
                            }}
                        >
                            {SHIJI_DATA.map((volume) => (
                                <option key={volume.id} value={volume.id}>
                                    {volume.title}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <aside className="hidden min-w-0 lg:block" aria-label="史记目录">
                    <div className="flex items-baseline justify-between gap-2 border-b border-rule pb-2">
                        <h2 className="text-label font-semibold text-ink-2">目录</h2>
                        <span className="tabular text-caption text-ink-3">共 {SHIJI_TOTAL} 篇</span>
                    </div>
                    <ul>
                        {SHIJI_DATA.map((volume) => {
                            const isSelected = selectedVolume?.id === volume.id;
                            return (
                                <li key={volume.id} className="border-b border-divider">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedVolume(volume)}
                                        aria-pressed={isSelected}
                                        className={`block w-full px-3 py-3 text-left transition-colors ${
                                            isSelected
                                                ? 'bg-paper-2 text-accent-hover'
                                                : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
                                        }`}
                                    >
                                        <span
                                            className={`block text-body-s ${
                                                isSelected ? 'font-semibold' : 'font-medium'
                                            }`}
                                        >
                                            {volume.title}
                                        </span>
                                        <span
                                            className={`mt-0.5 block text-caption ${
                                                isSelected ? 'text-accent-hover' : 'text-ink-3'
                                            }`}
                                        >
                                            {volume.chapter}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                <article className="min-w-0 max-w-[68ch]">
                    {selectedVolume ? (
                        <>
                            <header>
                                <h2 className="font-serif text-section font-semibold text-ink">
                                    {selectedVolume.title}
                                </h2>
                                <p className="mt-1 font-serif text-body-s text-ink-3">
                                    {selectedVolume.chapter}
                                </p>
                            </header>

                            <div className="mt-6 space-y-6">
                                {selectedVolume.content.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className="font-serif text-body leading-loose text-ink"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            <section className="section">
                                <h2 className="section-head">
                                    <Icon name="sparkle" className="h-4 w-4" />
                                    AI 名师解读
                                </h2>
                                <div className="prose-body mt-4">
                                    <ReactMarkdown components={{ h1: 'h3' }}>
                                        {stripHeadingEmoji(selectedVolume.interpretation)}
                                    </ReactMarkdown>
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="empty-state">
                            <Icon name="scroll" className="h-10 w-10 text-ink-3" />
                            <p className="text-body-s text-ink-2">请选择篇章</p>
                        </div>
                    )}
                </article>
            </div>
        </>
    );
};
