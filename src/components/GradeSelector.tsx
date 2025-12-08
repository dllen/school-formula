import React from 'react';
import { type GradeLevel, KNOWLEDGE_DATA } from '../data/knowledge';

interface GradeSelectorProps {
    selectedGrade: GradeLevel;
    onSelectGrade: (grade: GradeLevel) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrade, onSelectGrade }) => {
    return (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl shadow-inner sm:w-fit w-full">
            {KNOWLEDGE_DATA.map((grade) => (
                <button
                    key={grade.id}
                    onClick={() => onSelectGrade(grade.id)}
                    className={`
            flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
            ${selectedGrade === grade.id
                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }
          `}
                >
                    {grade.name}
                </button>
            ))}
        </div>
    );
};
