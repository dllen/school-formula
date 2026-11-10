import React from 'react';
import { Icon } from '../icons/Icon';
import { iconFor } from '../icons/iconFor';

type HeaderProps = {
    point: { title: string; description: string; tags?: string[] };
    subject: { icon?: string; name: string };
};

export const Header: React.FC<HeaderProps> = ({ point, subject }) => {
    const visibleTags = (point.tags ?? []).filter((tag) => /[\u4e00-\u9fa5]/.test(tag));

    return (
        <header>
            <div className="flex items-center gap-2 text-ink-3">
                <Icon name={iconFor(subject.icon)} className="h-4 w-4" />
                <span className="text-label">{subject.name}</span>
            </div>

            <h1 className="mt-3 text-display tracking-tight text-ink">{point.title}</h1>

            <p className="mt-2 max-w-prose text-body text-ink-2">{point.description}</p>

            {visibleTags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                    {visibleTags.map((tag) => (
                        <li key={tag}>
                            <span className="tag">{tag}</span>
                        </li>
                    ))}
                </ul>
            )}
        </header>
    );
};
