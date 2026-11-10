import React from 'react';
import { type GradeLevel, KNOWLEDGE_DATA } from '../data/knowledge';

interface GradeSelectorProps {
    selectedGrade: GradeLevel;
    onSelectGrade: (grade: GradeLevel) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrade, onSelectGrade }) => {
    return (
        <div className="flex space-x-1 bg-paper-3 p-1 rounded-xl shadow-inner sm:w-fit w-full">
            {KNOWLEDGE_DATA.map((grade) => (
                <button
                    key={grade.id}
                    onClick={() => onSelectGrade(grade.id)}
                    className={`
            flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
            ${selectedGrade === grade.id
                            ? 'bg-white text-accent shadow-sm ring-1 ring-black/5'
                            : 'text-ink-3 hover:text-ink-2 hover:bg-rule/50'
                        }
          `}
                >
                    {grade.name}
                </button>
            ))}
        </div>
    );
};
