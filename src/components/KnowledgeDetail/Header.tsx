import React from 'react';
import { Icon } from '../icons/Icon';
import { iconFor } from '../icons/iconFor';

type HeaderProps = {
    point: { title: string; description: string; tags?: string[] };
    subject: { icon?: string; name: string };
};

export const Header: React.FC<HeaderProps> = ({ point, subject }) => {
    return (
        <div className="p-8 border-b border-[divider] bg-accent-soft">
            <div className="flex items-center gap-4 mb-4">
                <Icon name={iconFor(subject.icon)} className="w-10 h-10" />
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-[ink]">{point.title}</h1>
                        <span className="bg-accent-soft text-accent-active text-xs px-2.5 py-0.5 rounded-full font-medium">
                            {subject.name}
                        </span>
                    </div>
                    <p className="text-[ink-2] mt-2 text-lg">{point.description}</p>
                </div>
            </div>

            {point.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {point.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-white border border-accent-soft text-[accent] text-sm rounded-full shadow-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
