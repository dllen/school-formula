import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TutorialUnit } from '../../data/tutorials';
import { Icon } from '../icons/Icon';

interface TutorialTeachTabProps {
  unit: TutorialUnit;
}

export const TutorialTeachTab: React.FC<TutorialTeachTabProps> = ({ unit }) => {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="flex items-center text-xl font-bold text-accent-active mb-4">
          <Icon name="target" className="mr-2 w-5 h-5" /> 学习目标
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {unit.objectives.map((obj, idx) => (
            <div key={idx} className="bg-accent-soft p-4 rounded-xl border border-accent-soft flex items-start">
              <span className="bg-accent-soft-hover text-accent-active w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                {idx + 1}
              </span>
              <p className="text-accent-active">{obj}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="flex items-center text-xl font-bold text-warning-ink mb-4">
          <Icon name="book-open" className="mr-2 w-5 h-5" /> 课程引入
        </h3>
        <div className="bg-warning-bg/60 border border-warning-bg rounded-2xl p-6 prose prose-amber max-w-none">
          <ReactMarkdown>{unit.teach.hook}</ReactMarkdown>
        </div>
      </section>

      <section>
        <h3 className="flex items-center text-xl font-bold text-ink mb-4">
          <Icon name="idea" className="mr-2 w-5 h-5" /> 本课概要
        </h3>
        <div className="bg-paper-2 border border-paper-3 rounded-2xl p-6 prose prose-indigo max-w-none">
          <ReactMarkdown>{unit.teach.summary}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
};
