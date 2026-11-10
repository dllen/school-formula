import React, { useState } from 'react';
import { ALL_TUTORIALS, type Tutorial, type TutorialUnit } from '../data/tutorials';
import { TutorialUnitDetail } from './tutorials/TutorialUnitDetail';
import { Icon, type IconName } from './icons/Icon';
import { iconFor } from './icons/iconFor';

type Subject = 'math' | 'chinese' | 'english' | 'science' | 'moral';

const SUBJECTS: { id: Subject; name: string; icon: IconName }[] = [
  { id: 'math', name: '数学', icon: 'math' },
  { id: 'chinese', name: '语文', icon: 'clipboard' },
  { id: 'english', name: '英语', icon: 'text' },
  { id: 'science', name: '科学', icon: 'lab' },
  { id: 'moral', name: '道德与法治', icon: 'balance' },
];

const GRADES: { id: string; name: string }[] = [
  { id: '1', name: '一年级' },
  { id: '2', name: '二年级' },
  { id: '3', name: '三年级' },
  { id: '4', name: '四年级' },
  { id: '5', name: '五年级' },
  { id: '6', name: '六年级' },
];

export const TutorialView: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('math');
  const [selectedGrade, setSelectedGrade] = useState<string>('1');
  const [selectedUnit, setSelectedUnit] = useState<TutorialUnit | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const subjectNameMap: Record<Subject, string> = {
    math: '数学',
    chinese: '语文',
    english: '英语',
    science: '科学',
    moral: '道德与法治',
  };

  const tutorial = ALL_TUTORIALS.find(t => t.grade === selectedGrade && t.subject === subjectNameMap[selectedSubject]) || null;

  const handleSubjectChange = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedGrade('1');
    setSelectedUnit(null);
    setSelectedTutorial(null);
  };

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedUnit(null);
    setSelectedTutorial(null);
  };

  const handleSelectUnit = (unit: TutorialUnit, t: Tutorial) => {
    setSelectedUnit(unit);
    setSelectedTutorial(t);
  };

  const handleBack = () => {
    setSelectedUnit(null);
    setSelectedTutorial(null);
  };

  if (selectedUnit && selectedTutorial) {
    return (
      <TutorialUnitDetail
        unit={selectedUnit}
        tutorial={selectedTutorial}
        onBack={handleBack}
      />
    );
  }

  return (
    <>
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">教程</h1>
          <p className="page-lead">系统学习小学课程：教、学、练一体化</p>
        </div>
        <div className="page-controls w-full sm:w-auto">
          <div className="seg seg--wrap" role="group" aria-label="选择学科">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                type="button"
                aria-pressed={selectedSubject === subject.id}
                onClick={() => handleSubjectChange(subject.id)}
                className="seg-btn gap-1.5"
              >
                <Icon name={subject.icon} className="h-4 w-4" />
                {subject.name}
              </button>
            ))}
          </div>
          <div className="seg seg--wrap" role="group" aria-label="选择年级">
            {GRADES.map((grade) => (
              <button
                key={grade.id}
                type="button"
                aria-pressed={selectedGrade === grade.id}
                onClick={() => handleGradeChange(grade.id)}
                className="seg-btn"
              >
                {grade.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tutorial ? (
        <section aria-labelledby="tutorial-title">
          <div className="flex items-start gap-3 border-b border-divider pb-4">
            <Icon
              name={iconFor(tutorial.subjectIcon)}
              className="mt-0.5 h-6 w-6 shrink-0 text-ink-3"
            />
            <div className="min-w-0">
              <h2 id="tutorial-title" className="text-subhead font-semibold text-ink">
                {tutorial.title}
              </h2>
              <p className="mt-1 text-body-s text-ink-2">{tutorial.description}</p>
            </div>
          </div>

          <ul className="grid-tail-span grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {tutorial.units.map((unit) => (
              <li key={unit.id} className="border-b border-divider">
                <button
                  type="button"
                  onClick={() => handleSelectUnit(unit, tutorial)}
                  className="block w-full px-2 py-3 text-left transition-colors hover:bg-paper-2"
                >
                  <span className="flex items-baseline justify-between gap-3 text-caption text-ink-3">
                    <span className="tabular">第 {unit.order} 课</span>
                    <span>{unit.duration}</span>
                  </span>
                  <h3 className="mt-1 text-title font-semibold text-ink">{unit.title}</h3>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-body-s text-ink-2 marker:text-ink-3">
                    {unit.objectives.slice(0, 2).map((obj, idx) => (
                      <li key={idx} className="line-clamp-2">
                        {obj}
                      </li>
                    ))}
                    {unit.objectives.length > 2 && (
                      <li className="list-none text-caption text-ink-3">
                        +{unit.objectives.length - 2} 项目标
                      </li>
                    )}
                  </ul>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="empty-state">
          <Icon name="book" className="h-10 w-10" />
          <p className="text-body-s text-ink-2">该年级暂无教程</p>
        </div>
      )}
    </>
  );
};
