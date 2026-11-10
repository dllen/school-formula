import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TutorialUnit } from '../../data/tutorials';
import { Icon } from '../icons/Icon';

interface TutorialTeachTabProps {
  unit: TutorialUnit;
}

export const TutorialTeachTab: React.FC<TutorialTeachTabProps> = ({ unit }) => {
  return (
    <div>
      <section className="section" aria-labelledby="teach-objectives">
        <h2 id="teach-objectives" className="section-head">
          <Icon name="target" className="h-5 w-5" />
          学习目标
        </h2>
        <ol className="mt-3 max-w-prose divide-y divide-divider border-y border-rule">
          {unit.objectives.map((obj, idx) => (
            <li key={idx} className="flex items-start gap-3 py-2.5">
              <span className="tabular pt-0.5 text-caption text-ink-3">{idx + 1}</span>
              <p className="text-body-s text-ink">{obj}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="teach-hook">
        <h2 id="teach-hook" className="section-head">
          <Icon name="book-open" className="h-5 w-5" />
          课程引入
        </h2>
        <div className="prose-body mt-3">
          <ReactMarkdown>{unit.teach.hook}</ReactMarkdown>
        </div>
      </section>

      <section className="section" aria-labelledby="teach-summary">
        <h2 id="teach-summary" className="section-head">
          <Icon name="idea" className="h-5 w-5" />
          本课概要
        </h2>
        <div className="prose-body mt-3">
          <ReactMarkdown>{unit.teach.summary}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
};
