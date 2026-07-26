import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TutorialUnit } from '../../data/tutorials';
import { TutorialDiagram } from './TutorialDiagram';

interface TutorialLearnTabProps {
  unit: TutorialUnit;
}

export const TutorialLearnTab: React.FC<TutorialLearnTabProps> = ({ unit }) => {
  return (
    <div className="space-y-8">
      {unit.learn.sections.map((section, idx) => (
        <section key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mr-3">
              {idx + 1}
            </span>
            {section.title}
          </h3>
          <div className="prose prose-indigo max-w-none text-gray-700">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>

          {section.diagrams && section.diagrams.length > 0 && (
            <div className="mt-4 space-y-4">
              {section.diagrams.map((diagram, dIdx) => (
                <TutorialDiagram key={dIdx} diagram={diagram} />
              ))}
            </div>
          )}

          {section.examples && section.examples.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-bold text-gray-900">例题精讲</h4>
              {section.examples.map((example, eIdx) => (
                <div key={eIdx} className="bg-blue-50/60 border border-blue-100 rounded-xl p-5">
                  <div className="font-bold text-blue-900 mb-2">{example.title}</div>
                  <div className="text-gray-800 mb-3">
                    <span className="font-medium text-gray-900">题目：</span>{example.problem}
                  </div>
                  <div className="text-gray-800 mb-2">
                    <span className="font-medium text-gray-900">解答：</span>{example.solution}
                  </div>
                  <div className="text-sm text-blue-700 bg-white/60 rounded-lg p-2">
                    <span className="font-medium">💡 点拨：</span>{example.tip}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {unit.learn.tips.length > 0 && (
        <section>
          <h3 className="flex items-center text-xl font-bold text-amber-900 mb-4">
            <span className="mr-2">🎓</span> 学习锦囊
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {unit.learn.tips.map((tip, idx) => (
              <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-amber-900">{tip}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
