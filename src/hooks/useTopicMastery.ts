import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'school_formula_topic_mastery';

export interface TopicMastery {
  totalAttempts: number;
  correctCount: number;
  lastPracticed: number | null;
}

function getDefault(): TopicMastery {
  return { totalAttempts: 0, correctCount: 0, lastPracticed: null };
}

/**
 * 专题掌握度 — 按知识点（=专题）独立记录，与通用学习进度（useLearningProgress）分开。
 * 错题本仍共享 useErrorBook；这里只负责「这个专题练了多少、对多少」。
 */
export function useTopicMastery() {
  const [masteryById, setMasteryById] = useState<Record<string, TopicMastery>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(masteryById));
  }, [masteryById]);

  const recordTopicAttempt = useCallback(
    (topicId: string, correct: number, total: number) => {
      setMasteryById((prev) => {
        const prevMastery = prev[topicId] ?? getDefault();
        return {
          ...prev,
          [topicId]: {
            totalAttempts: prevMastery.totalAttempts + total,
            correctCount: prevMastery.correctCount + correct,
            lastPracticed: Date.now(),
          },
        };
      });
    },
    [],
  );

  const getMastery = useCallback(
    (topicId: string): TopicMastery => masteryById[topicId] ?? getDefault(),
    [masteryById],
  );

  const masteryPercent = useCallback(
    (topicId: string): number => {
      const m = masteryById[topicId];
      if (!m || m.totalAttempts === 0) return 0;
      return Math.round((m.correctCount / m.totalAttempts) * 100);
    },
    [masteryById],
  );

  const resetTopic = useCallback((topicId: string) => {
    setMasteryById((prev) => {
      const next = { ...prev };
      delete next[topicId];
      return next;
    });
  }, []);

  return { masteryById, recordTopicAttempt, getMastery, masteryPercent, resetTopic };
}
