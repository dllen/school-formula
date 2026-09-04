import type { Question } from '../data/questions/types';

/**
 * Check if a user's answer matches the correct answer.
 * Handles all question types with appropriate comparison logic.
 */
export function checkAnswer(userAnswer: string, question: Question): boolean {
  if (!userAnswer && userAnswer !== 'false') return false;

  switch (question.type) {
    case 'choice':
      return userAnswer === question.answer;
    case 'fill-blank':
      return userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    case 'true-false':
      return userAnswer === question.answer;
    default:
      return false;
  }
}

/**
 * Get the display label for a difficulty level.
 */
export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    basic: '基础',
    intermediate: '提高',
    advanced: '挑战',
  };
  return labels[difficulty] || difficulty;
}

/**
 * Get the display label for a question type.
 */
export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    choice: '选择',
    'fill-blank': '填空',
    'true-false': '判断',
  };
  return labels[type] || type;
}

/**
 * Format seconds into a readable time string.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}:${secs.toString().padStart(2, '0')}`;
  return `${secs}s`;
}
