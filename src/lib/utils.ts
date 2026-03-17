import { PROGRAM_START_DATE, PHASES } from './program-config';
import { WORKOUT_SCHEDULE, NUTRITION_SCHEDULE } from './program-config';
import type { ProgramPhase, WorkoutDayType, NutritionDayType } from '@/types/program';

export function getCurrentWeek(startDate: string = PROGRAM_START_DATE): number {
  const start = new Date(startDate + 'T00:00:00');
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 0; // before program start
  const week = Math.floor(diffDays / 7) + 1;
  return Math.min(week, 12);
}

export function getCurrentPhase(week: number): { phase: ProgramPhase; label: string } {
  for (const p of PHASES) {
    if (week >= p.weekStart && week <= p.weekEnd) {
      return { phase: p.phase, label: p.label };
    }
  }
  return { phase: 'push', label: 'Push' };
}

export function getTodayDayType(): WorkoutDayType {
  const day = new Date().getDay(); // 0=Sun
  return WORKOUT_SCHEDULE[day];
}

export function getDayTypeForDate(date: Date): WorkoutDayType {
  return WORKOUT_SCHEDULE[date.getDay()];
}

export function getNutritionDayType(): NutritionDayType {
  const day = new Date().getDay();
  return NUTRITION_SCHEDULE[day];
}

export function getNutritionDayTypeForDate(date: Date): NutritionDayType {
  return NUTRITION_SCHEDULE[date.getDay()];
}

/** Epley formula: estimated 1RM = weight × (1 + reps / 30) */
export function estimateOneRepMax(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/** Returns YYYY-MM-DD in local time (no timezone shift) */
export function toLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayLabel(dayType: WorkoutDayType): string {
  const labels: Record<WorkoutDayType, string> = {
    heavy_upper: 'Heavy Upper',
    heavy_lower: 'Heavy Lower',
    upper_hypertrophy: 'Upper Hypertrophy',
    lower_hypertrophy: 'Lower Hypertrophy',
    abs_forearms: 'Abs + Forearms',
  };
  return labels[dayType];
}

export function getDayOfWeekName(dayIndex: number): string {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
}
