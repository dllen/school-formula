import React, { useMemo } from 'react';
import { KNOWLEDGE_DATA } from '../../data/knowledge';
import { getQuestionsByKnowledgePoint } from '../../data/questions';
import type { GradeLevel } from '../../data/knowledge';
import type { TopicMastery } from '../../hooks/useTopicMastery';

interface TopicPickerProps {
  selectedGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  masteryById: Record<string, TopicMastery>;
  masteryPercent: (topicId: string) => number;
  onPickTopic: (knowledgePointId: string) => void;
  /** 进度看板插在页头与专题清单之间。 */
  children?: React.ReactNode;
}

const GRADE_TABS: { id: GradeLevel; label: string }[] = [
  { id: 'primary', label: '小学' },
  { id: 'middle', label: '初中' },
  { id: 'high', label: '高中' },
];

interface TopicStat {
  kpId: string;
  title: string;
  subject: string;
  icon: string;
  count: number;
  mastery: number;
}

/** 掌握度只做一层表意：颜色按阈值分三档，数值永远同步显示。 */
function masteryTone(mastery: number): string {
  if (mastery >= 80) return 'bg-success';
  if (mastery >= 50) return 'bg-warning';
  return 'bg-rule-strong';
}

/**
 * 专题目录里的一行：标题、学科与题数、掌握度与一根 2px 进度条。
 * 暂未备题的知识点保持 disabled 按钮，整行变淡。
 */
const TopicRow: React.FC<{ topic: TopicStat; onPickTopic: (knowledgePointId: string) => void }> = ({
  topic,
  onPickTopic,
}) => {
  return (
    <button
      type="button"
      onClick={() => topic.count > 0 && onPickTopic(topic.kpId)}
      disabled={topic.count === 0}
      className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-divider px-2 py-3 text-left transition-colors hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
    >
      <span className="min-w-0">
        <span className="block text-title font-semibold text-ink">{topic.title}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-2 text-caption text-ink-3">
          <span>{topic.subject}</span>
          <span aria-hidden="true" className="h-3 w-px bg-rule" />
          <span className="tabular">{topic.count} 题</span>
        </span>
        {topic.count === 0 && (
          <span className="mt-1 block text-caption text-ink-3">题目准备中…</span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-2 pt-1">
        <span aria-hidden="true" className="h-0.5 w-16 overflow-hidden rounded-full bg-paper-3">
          <span
            className={`block h-full rounded-full ${masteryTone(topic.mastery)}`}
            style={{ width: `${topic.mastery}%` }}
          />
        </span>
        <span className="tabular text-caption text-ink-2">{topic.mastery}%</span>
      </span>
    </button>
  );
};

/**
 * 练习专题目录：页头带学段切换，进度看板落在两者之间，下面是一张两栏的专题清单。
 * 已备题的专题排成主清单；暂未备题的收进一个原生 details，数量由数据算出来。
 */
export const TopicPicker: React.FC<TopicPickerProps> = ({
  selectedGrade,
  onGradeChange,
  masteryPercent,
  onPickTopic,
  children,
}) => {
  const gradeData = KNOWLEDGE_DATA.find((g) => g.id === selectedGrade)!;

  const { withQuestions, withoutQuestions } = useMemo(() => {
    const rows: TopicStat[] = [];
    gradeData.subjects.forEach((subject) => {
      subject.knowledgePoints.forEach((kp) => {
        const count = getQuestionsByKnowledgePoint(kp.id).length;
        rows.push({
          kpId: kp.id,
          title: kp.title,
          subject: subject.name,
          icon: subject.icon ?? 'book',
          count,
          mastery: masteryPercent(kp.id),
        });
      });
    });
    return {
      withQuestions: rows.filter((row) => row.count > 0),
      withoutQuestions: rows.filter((row) => row.count === 0),
    };
  }, [gradeData, masteryPercent]);

  return (
    <div>
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">选择练习专题</h1>
          <p className="page-lead">每个专题 20-30 道题，按知识点逐个击破</p>
        </div>
        <div className="seg">
          {GRADE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="seg-btn"
              aria-pressed={selectedGrade === tab.id}
              onClick={() => onGradeChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {children}

      {withQuestions.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-x-10 border-t border-divider sm:mt-10 md:grid-cols-2">
          {withQuestions.map((topic) => (
            <TopicRow key={topic.kpId} topic={topic} onPickTopic={onPickTopic} />
          ))}
        </div>
      )}

      {withoutQuestions.length > 0 && (
        <details className="group mt-6">
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md px-2 py-3 text-body-s text-ink-2 transition-colors hover:bg-paper-2 group-open:border-b group-open:border-divider [&::-webkit-details-marker]:hidden">
            <span>
              另有 <span className="tabular">{withoutQuestions.length}</span> 个知识点暂无题目
            </span>
            <span
              aria-hidden="true"
              className="ml-auto h-2 w-2 rotate-45 border-t border-r border-rule-strong group-open:rotate-[135deg]"
            />
          </summary>
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {withoutQuestions.map((topic) => (
              <TopicRow key={topic.kpId} topic={topic} onPickTopic={onPickTopic} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
};
