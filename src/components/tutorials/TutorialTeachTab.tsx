import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TutorialUnit } from '../../data/tutorials';

interface TutorialTeachTabProps {
  unit: TutorialUnit;
}

export const TutorialTeachTab: React.FC<TutorialTeachTabProps> = ({ unit }) => {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="flex items-center text-xl font-bold text-indigo-900 mb-4">
          <span className="mr-2">🎯</span> 学习目标
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {unit.objectives.map((obj, idx) => (
            <div key={idx} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start">
              <span className="bg-indigo-200 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                {idx + 1}
              </span>
              <p className="text-indigo-900">{obj}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="flex items-center text-xl font-bold text-amber-900 mb-4">
          <span className="mr-2">📖</span> 课程引入
        </h3>
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-6 prose prose-amber max-w-none">
          <ReactMarkdown>{unit.teach.hook}</ReactMarkdown>
        </div>
      </section>

      <section>
        <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
          <span className="mr-2">💡</span> 本课概要
        </h3>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 prose prose-indigo max-w-none">
          <ReactMarkdown>{unit.teach.summary}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
};
