import React from 'react';

type HeaderProps = {
    point: { title: string; description: string; tags?: string[] };
    subject: { icon?: string; name: string };
};

export const Header: React.FC<HeaderProps> = ({ point, subject }) => {
    return (
        <div className="p-8 border-b border-[#F0F1F2] bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{subject.icon}</span>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-[#1F2329]">{point.title}</h1>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            {subject.name}
                        </span>
                    </div>
                    <p className="text-[#646A73] mt-2 text-lg">{point.description}</p>
                </div>
            </div>

            {point.tags && (
                <div className="flex gap-2 mt-4">
                    {point.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-white border border-blue-100 text-[#3370FF] text-sm rounded-full shadow-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
