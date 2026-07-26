import React, { useState } from 'react';
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
  const [selectedGrade, setSelectedGrade] = useState<string>('1');
  const [selectedUnit, setSelectedUnit] = useState<TutorialUnit | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const tutorial = ALL_TUTORIALS.find(t => t.grade === selectedGrade) || null;

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
          <h2 className="text-2xl font-bold text-gray-900">教程</h2>
          <p className="text-sm text-gray-500">系统学习小学数学：教、学、练一体化</p>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl shadow-inner sm:w-fit w-full">
          {GRADES.map((grade) => (
            <button
              key={grade.id}
              onClick={() => handleGradeChange(grade.id)}
              className={`
                flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${selectedGrade === grade.id
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
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
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tutorial.subjectIcon}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{tutorial.title}</h3>
                <p className="text-sm text-gray-500">{tutorial.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorial.units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit, tutorial)}
                className="text-left bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    第 {unit.order} 课
                  </span>
                  <span className="text-xs text-gray-400">{unit.duration}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-3">
                  {unit.title}
                </h4>
                <ul className="space-y-1.5">
                  {unit.objectives.slice(0, 2).map((obj, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      <span className="line-clamp-2">{obj}</span>
                    </li>
                  ))}
                  {unit.objectives.length > 2 && (
                    <li className="text-xs text-gray-400 pl-4">+{unit.objectives.length - 2} 项目标</li>
                  )}
                </ul>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="text-6xl mb-4 grayscale opacity-30">📚</div>
          <p className="text-lg text-gray-400">该年级暂无教程</p>
        </div>
      )}
    </div>
  );
};
