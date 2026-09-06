import React, { useState } from 'react';

type Subject = 'math' | 'chinese' | 'english';

const SUBJECTS: { id: Subject; name: string; icon: string }[] = [
  { id: 'math', name: '数学', icon: '🔢' },
  { id: 'chinese', name: '语文', icon: '📝' },
  { id: 'english', name: '英语', icon: '🔤' },
];
import { ALL_TUTORIALS, type Tutorial, type TutorialUnit } from '../data/tutorials';
import { TutorialUnitDetail } from './tutorials/TutorialUnitDetail';

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

  const tutorial = ALL_TUTORIALS.find(t => t.grade === selectedGrade && t.subject === (selectedSubject === 'math' ? '数学' : selectedSubject === 'chinese' ? '语文' : '英语')) || null;

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2329]">教程</h2>
          <p className="text-sm text-[#646A73]">系统学习小学课程：教、学、练一体化</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex space-x-1 bg-[#F5F6F7] p-1 rounded-xl shadow-inner">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSubjectChange(subject.id)}
                className={`flex-1 sm:flex-none px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                  selectedSubject === subject.id
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                    : 'text-[#646A73] hover:text-[#1F2329] hover:bg-gray-200/50'
                }`}
              >
                <span>{subject.icon}</span>
                <span>{subject.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-x-1 bg-[#F5F6F7] p-1 rounded-xl shadow-inner sm:w-fit w-full">
          {GRADES.map((grade) => (
            <button
              key={grade.id}
              onClick={() => handleGradeChange(grade.id)}
              className={`
                flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${selectedGrade === grade.id
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-[#646A73] hover:text-[#1F2329] hover:bg-gray-200/50'
                }
              `}
            >
              {grade.name}
            </button>
          ))}
        </div>
      </div>

      {tutorial ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#F0F1F2]">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tutorial.subjectIcon}</span>
              <div>
                <h3 className="text-xl font-bold text-[#1F2329]">{tutorial.title}</h3>
                <p className="text-sm text-[#646A73]">{tutorial.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorial.units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit, tutorial)}
                className="text-left bg-white p-6 rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    第 {unit.order} 课
                  </span>
                  <span className="text-xs text-[#8F959E]">{unit.duration}</span>
                </div>
                <h4 className="text-lg font-bold text-[#1F2329] group-hover:text-indigo-700 transition-colors mb-3">
                  {unit.title}
                </h4>
                <ul className="space-y-1.5">
                  {unit.objectives.slice(0, 2).map((obj, idx) => (
                    <li key={idx} className="text-sm text-[#646A73] flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="line-clamp-2">{obj}</span>
                    </li>
                  ))}
                  {unit.objectives.length > 2 && (
                    <li className="text-xs text-[#8F959E] pl-4">+{unit.objectives.length - 2} 项目标</li>
                  )}
                </ul>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-[#F5F6F7] rounded-3xl border border-dashed border-[#E5E6EB]">
          <div className="text-6xl mb-4 grayscale opacity-30">📚</div>
          <p className="text-lg text-[#8F959E]">该年级暂无教程</p>
        </div>
      )}
    </div>
  );
};
