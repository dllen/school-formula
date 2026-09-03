import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'school_formula_progress';

export interface DailyProgress {
  date: string;          // YYYY-MM-DD
  questionsAnswered: number;
  correctCount: number;
  timeSpent: number;     // seconds
  streak: number;        // consecutive days
}

export interface LearningProgress {
  totalAnswered: number;
  totalCorrect: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  dailyRecords: DailyProgress[];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultProgress(): LearningProgress {
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    dailyRecords: [],
  };
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : getDefaultProgress();
    } catch {
      return getDefaultProgress();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const recordPractice = useCallback((answered: number, correct: number, timeSpent: number) => {
    setProgress(prev => {
      const today = getToday();
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Calculate streak
      let newStreak = prev.currentStreak;
      if (prev.lastPracticeDate === yesterday) {
        newStreak = prev.currentStreak + 1;
      } else if (prev.lastPracticeDate !== today) {
        newStreak = 1;
      }

      // Update or create today's record
      const existingDayIdx = prev.dailyRecords.findIndex(r => r.date === today);
      const updatedRecords = [...prev.dailyRecords];

      if (existingDayIdx >= 0) {
        const existing = updatedRecords[existingDayIdx];
        updatedRecords[existingDayIdx] = {
          ...existing,
          questionsAnswered: existing.questionsAnswered + answered,
          correctCount: existing.correctCount + correct,
          timeSpent: existing.timeSpent + timeSpent,
          streak: newStreak,
        };
      } else {
        updatedRecords.push({
          date: today,
          questionsAnswered: answered,
          correctCount: correct,
          timeSpent,
          streak: newStreak,
        });
      }

      return {
        totalAnswered: prev.totalAnswered + answered,
        totalCorrect: prev.totalCorrect + correct,
        totalTimeSpent: prev.totalTimeSpent + timeSpent,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastPracticeDate: today,
        dailyRecords: updatedRecords,
      };
    });
  }, []);

  const getTodayStats = useCallback((): { answered: number; correct: number; timeSpent: number } => {
    const today = getToday();
    const todayRecord = progress.dailyRecords.find(r => r.date === today);
    return todayRecord
      ? { answered: todayRecord.questionsAnswered, correct: todayRecord.correctCount, timeSpent: todayRecord.timeSpent }
      : { answered: 0, correct: 0, timeSpent: 0 };
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress(getDefaultProgress());
  }, []);

  return { progress, recordPractice, getTodayStats, resetProgress };
}
