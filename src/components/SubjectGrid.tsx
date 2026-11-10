import React from 'react';
import type { Subject } from '../data/knowledge';
import { Icon } from './icons/Icon';
import { iconFor } from './icons/iconFor';

interface SubjectGridProps {
    subjects: Subject[];
    selectedSubjectId: string | null;
    onSelectSubject: (subject: Subject) => void;
}

/** The subject rail beside the knowledge index. One list, not a grid of cards. */
export const SubjectGrid: React.FC<SubjectGridProps> = ({ subjects, selectedSubjectId, onSelectSubject }) => {
    return (
        <nav aria-label="选择学科">
            <ul className="rail">
                {subjects.map((subject) => (
                    <li key={subject.id}>
                        <button
                            type="button"
                            aria-pressed={selectedSubjectId === subject.id}
                            aria-label={`${subject.name}，${subject.knowledgePoints.length} 个知识点`}
                            onClick={() => onSelectSubject(subject)}
                            className="rail-item"
                        >
                            <Icon name={iconFor(subject.icon)} className="w-[18px] h-[18px] rail-item__icon" />
                            <span className="truncate">{subject.name}</span>
                            <span className="rail-count" aria-hidden="true">
                                {subject.knowledgePoints.length}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
