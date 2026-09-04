import type { MasteryProgress, PracticeRecord } from './types';

const STORAGE_KEY = 'math_mastery_progress';

export function loadProgress(): MasteryProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return { records: {}, completedTechniques: [] };
}

export function saveProgress(progress: MasteryProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordAttempt(
  techniqueId: string,
  correct: boolean,
  point: string
): MasteryProgress {
  const progress = loadProgress();
  const record: PracticeRecord = progress.records[techniqueId] || {
    techniqueId,
    totalAttempts: 0,
    correctCount: 0,
    lastPracticedAt: 0,
    weakPoints: [],
  };

  record.totalAttempts++;
  if (correct) {
    record.correctCount++;
  } else {
    if (!record.weakPoints.includes(point)) {
      record.weakPoints.push(point);
    }
  }
  record.lastPracticedAt = Date.now();

  progress.records[techniqueId] = record;

  const accuracy = record.correctCount / record.totalAttempts;
  if (accuracy >= 0.8 && record.totalAttempts >= 5) {
    if (!progress.completedTechniques.includes(techniqueId)) {
      progress.completedTechniques.push(techniqueId);
    }
  }

  saveProgress(progress);
  return progress;
}

export function isTechniqueUnlocked(
  techniqueId: string,
  techniques: { id: string; prereq: string | null }[]
): boolean {
  const technique = techniques.find(t => t.id === techniqueId);
  if (!technique || !technique.prereq) return true;
  const progress = loadProgress();
  return progress.completedTechniques.includes(technique.prereq);
}

export function getWeakTechniques(): string[] {
  const progress = loadProgress();
  const weak: string[] = [];
  for (const [id, record] of Object.entries(progress.records)) {
    const accuracy = record.correctCount / record.totalAttempts;
    if (accuracy < 0.6) weak.push(id);
  }
  return weak;
}

export function getReviewTechniques(): string[] {
  const progress = loadProgress();
  const now = Date.now();
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  const review: string[] = [];
  for (const [id, record] of Object.entries(progress.records)) {
    if (now - record.lastPracticedAt > threeDays) {
      review.push(id);
    }
  }
  return review;
}
