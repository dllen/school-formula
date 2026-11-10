import React from 'react';
import { type GradeLevel, KNOWLEDGE_DATA } from '../data/knowledge';

interface GradeSelectorProps {
    selectedGrade: GradeLevel;
    onSelectGrade: (grade: GradeLevel) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrade, onSelectGrade }) => {
    return (
        <div className="seg" role="group" aria-label="选择学段">
            {KNOWLEDGE_DATA.map((grade) => (
                <button
                    key={grade.id}
                    type="button"
                    aria-pressed={selectedGrade === grade.id}
                    onClick={() => onSelectGrade(grade.id)}
                    className="seg-btn"
                >
                    {grade.name}
                </button>
            ))}
        </div>
    );
};
