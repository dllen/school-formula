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
}

const GRADE_TABS: { id: GradeLevel; label: string }[] = [
  { id: 'primary', label: '小学' },
  { id: 'middle', label: '初中' },
  { id: 'high', label: '高中' },
];

export const TopicPicker: React.FC<TopicPickerProps> = ({
  selectedGrade,
  onGradeChange,
  masteryPercent,
  onPickTopic,
}) => {
  const gradeData = KNOWLEDGE_DATA.find((g) => g.id === selectedGrade)!;

  const topicStats = useMemo(() => {
    const rows: {
      kpId: string;
      title: string;
      subject: string;
      icon: string;
      count: number;
      mastery: number;
    }[] = [];
    gradeData.subjects.forEach((subject) => {
      subject.knowledgePoints.forEach((kp) => {
        const count = getQuestionsByKnowledgePoint(kp.id).length;
        rows.push({
          kpId: kp.id,
          title: kp.title,
          subject: subject.name,
          icon: subject.icon ?? '📚',
          count,
          mastery: masteryPercent(kp.id),
        });
      });
    });
    return rows;
  }, [gradeData, masteryPercent]);

  return (
    <div className="space-y-6">
      {/* Grade tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2329]">选择练习专题</h2>
          <p className="text-sm text-[#646A73]">每个专题 20-30 道题，按知识点逐个击破</p>
        </div>
        <div className="inline-flex rounded-xl bg-white border border-[#E5E7EB] p-1 shadow-sm">
          {GRADE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onGradeChange(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedGrade === tab.id
                  ? 'bg-[#1F2329] text-white'
                  : 'text-[#646A73] hover:text-[#1F2329]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topicStats.map((t) => (
          <button
            key={t.kpId}
            onClick={() => t.count > 0 && onPickTopic(t.kpId)}
            disabled={t.count === 0}
            className={`group relative bg-white rounded-2xl border border-[#F0F1F2] p-5 text-left shadow-sm transition-all ${
              t.count === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-md hover:border-[#D1D5DB] cursor-pointer'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <div className="font-semibold text-[#1F2329] text-sm">{t.title}</div>
                  <div className="text-xs text-[#8F959E]">{t.subject} · {t.count} 题</div>
                </div>
              </div>
              <span className="text-xs font-medium text-[#646A73] bg-[#F5F6F7] px-2 py-0.5 rounded-full">
                {t.mastery}%
              </span>
            </div>

            {/* Mastery progress bar */}
            <div className="h-1.5 bg-[#F0F1F2] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  t.mastery >= 80
                    ? 'bg-emerald-500'
                    : t.mastery >= 50
                    ? 'bg-amber-500'
                    : 'bg-gray-300'
                }`}
                style={{ width: `${t.mastery}%` }}
              />
            </div>

            {t.count === 0 && (
              <div className="mt-2 text-xs text-[#8F959E]">题目准备中…</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
