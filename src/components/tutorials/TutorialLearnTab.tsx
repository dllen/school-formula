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
    <div>
      {unit.learn.sections.map((section, idx) => (
        <section key={idx} className="section">
          <h2 className="section-head">
            <span className="tabular text-caption font-normal text-ink-3">{idx + 1}</span>
            {section.title}
          </h2>

          <div className="prose-body mt-3">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>

          {section.diagrams && section.diagrams.length > 0 && (
            <div className="mt-4">
              {section.diagrams.map((diagram, dIdx) => (
                <TutorialDiagram key={dIdx} diagram={diagram} />
              ))}
            </div>
          )}

          {section.examples && section.examples.length > 0 && (
            <div className="mt-6">
              <h3 className="text-subhead font-semibold text-ink">例题精讲</h3>
              <div className="mt-3 divide-y divide-divider border-t border-rule">
                {section.examples.map((example, eIdx) => (
                  <article key={eIdx} className="py-4">
                    <h4 className="text-title font-semibold text-ink">{example.title}</h4>
                    <p className="mt-2 text-body-s text-ink">
                      <span className="font-medium">题目：</span>
                      {example.problem}
                    </p>
                    <p className="mt-1 text-body-s text-ink">
                      <span className="font-medium">解答：</span>
                      {example.solution}
                    </p>
                    <p className="mt-2 flex items-start gap-2 text-body-s text-ink-2">
                      <Icon name="idea" className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
                      <span>
                        <span className="font-medium text-ink-2">点拨：</span>
                        {example.tip}
                      </span>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      {unit.learn.tips.length > 0 && (
        <section className="section" aria-labelledby="learn-tips">
          <h2 id="learn-tips" className="section-head">
            <Icon name="trophy" className="h-5 w-5" />
            学习锦囊
          </h2>
          <ol className="mt-3 max-w-prose divide-y divide-divider border-y border-rule">
            {unit.learn.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 py-2.5">
                <span className="tabular pt-0.5 text-caption text-ink-3">{idx + 1}</span>
                <p className="text-body-s text-ink-2">{tip}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
};
