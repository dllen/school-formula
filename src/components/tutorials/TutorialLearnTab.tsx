import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TutorialUnit } from '../../data/tutorials';
import { TutorialDiagram } from './TutorialDiagram';
import { Icon } from '../icons/Icon';

interface TutorialLearnTabProps {
  unit: TutorialUnit;
}

export const TutorialLearnTab: React.FC<TutorialLearnTabProps> = ({ unit }) => {
  return (
    <div className="space-y-8">
      {unit.learn.sections.map((section, idx) => (
        <section key={idx} className="bg-white border border-paper-3 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-ink mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-soft text-accent-hover text-sm font-bold mr-3">
              {idx + 1}
            </span>
            {section.title}
          </h3>
          <div className="prose prose-indigo max-w-none text-ink-2">
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
              <h4 className="text-lg font-bold text-ink">例题精讲</h4>
              {section.examples.map((example, eIdx) => (
                <div key={eIdx} className="bg-accent-soft/60 border border-accent-soft rounded-xl p-5">
                  <div className="font-bold text-accent-active mb-2">{example.title}</div>
                  <div className="text-ink mb-3">
                    <span className="font-medium text-ink">题目：</span>{example.problem}
                  </div>
                  <div className="text-ink mb-2">
                    <span className="font-medium text-ink">解答：</span>{example.solution}
                  </div>
                  <div className="text-sm text-accent-hover bg-white/60 rounded-lg p-2">
                    <span className="font-medium flex items-start gap-1.5"><Icon name="idea" className="w-4 h-4 shrink-0 mt-0.5" />点拨：</span>{example.tip}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {unit.learn.tips.length > 0 && (
        <section>
          <h3 className="flex items-center text-xl font-bold text-warning-ink mb-4">
            <Icon name="trophy" className="mr-2 w-5 h-5" /> 学习锦囊
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {unit.learn.tips.map((tip, idx) => (
              <div key={idx} className="bg-warning-bg p-4 rounded-xl border border-warning-bg flex items-start">
                <span className="bg-warning-bg text-warning-ink w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-warning-ink">{tip}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
