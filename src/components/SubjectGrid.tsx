import React from 'react';
import type { Subject } from '../data/knowledge';

interface SubjectGridProps {
    subjects: Subject[];
    selectedSubjectId: string | null;
    onSelectSubject: (subject: Subject) => void;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({ subjects, selectedSubjectId, onSelectSubject }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => (
                <button
                    key={subject.id}
                    onClick={() => onSelectSubject(subject)}
                    className={`
            relative group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300
            ${selectedSubjectId === subject.id
                            ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-100'
                            : 'border-white bg-white hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 shadow-sm'
                        }
          `}
                >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {subject.icon || '📚'}
                    </div>
                    <span className={`
            font-bold text-lg
            ${selectedSubjectId === subject.id ? 'text-blue-700' : 'text-gray-700'}
          `}>
                        {subject.name}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">{subject.knowledgePoints.length} 个知识点</span>
                </button>
            ))}
        </div>
    );
};
