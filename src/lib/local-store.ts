// In-memory dev fallback when Supabase is not configured
// Auto-seeds milestones and lifting targets on first access

import type { WorkoutSession, ExerciseLog, NutritionLog, CheckIn, LiftingTarget, Milestone } from '@/types/database';
import { SEED_MILESTONES, SEED_LIFTING_TARGETS, PROGRAM_START_DATE } from './program-config';

function uuid(): string {
  return crypto.randomUUID();
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// In-memory stores — arrays are mutated in place, milestones/liftingTargets reassigned in ensureSeeded
const workoutSessions: WorkoutSession[] = [];
const exerciseLogs: ExerciseLog[] = [];
const nutritionLogs: NutritionLog[] = [];
const checkIns: CheckIn[] = [];
let liftingTargets: LiftingTarget[] = [];
let milestones: Milestone[] = [];
let seeded = false;

function ensureSeeded() {
  if (seeded) return;
  seeded = true;

  // Seed milestones
  milestones = SEED_MILESTONES.map(m => ({
    id: uuid(),
    description: m.description,
    target_date: addDays(PROGRAM_START_DATE, (m.targetWeek - 1) * 7),
    phase: m.phase,
    completed: false,
    completed_at: null,
    created_at: new Date().toISOString(),
  }));

  // Seed lifting targets
  liftingTargets = SEED_LIFTING_TARGETS.map(t => ({
    id: uuid(),
    exercise_name: t.exerciseName,
    baseline_weight: null,
    baseline_reps: null,
    week4_goal: t.week4Goal,
    week8_goal: t.week8Goal,
    week12_goal: t.week12Goal,
    current_max: null,
    updated_at: new Date().toISOString(),
  }));
}

// Workout Sessions
export function getWorkoutSessions(date?: string): WorkoutSession[] {
  ensureSeeded();
  if (date) return workoutSessions.filter(s => s.date === date);
  return [...workoutSessions].sort((a, b) => b.date.localeCompare(a.date));
}

export function createWorkoutSession(data: Omit<WorkoutSession, 'id' | 'created_at'>): WorkoutSession {
  ensureSeeded();
  const session: WorkoutSession = {
    id: uuid(),
    ...data,
    created_at: new Date().toISOString(),
  };
  workoutSessions.push(session);
  return session;
}

export function updateWorkoutSession(id: string, data: Partial<WorkoutSession>): WorkoutSession | null {
  ensureSeeded();
  const idx = workoutSessions.findIndex(s => s.id === id);
  if (idx === -1) return null;
  workoutSessions[idx] = { ...workoutSessions[idx], ...data };
  return workoutSessions[idx];
}

// Exercise Logs
export function getExerciseLogs(sessionId?: string): ExerciseLog[] {
  ensureSeeded();
  if (sessionId) return exerciseLogs.filter(l => l.session_id === sessionId);
  return exerciseLogs;
}

export function getLastExerciseLogs(exerciseName: string): ExerciseLog[] {
  ensureSeeded();
  // Find the most recent session that has this exercise
  const logsForExercise = exerciseLogs
    .filter(l => l.exercise_name === exerciseName)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  if (logsForExercise.length === 0) return [];

  const lastSessionId = logsForExercise[0].session_id;
  return logsForExercise.filter(l => l.session_id === lastSessionId);
}

export function createExerciseLog(data: Omit<ExerciseLog, 'id' | 'created_at' | 'is_pr'>): ExerciseLog & { is_pr: boolean } {
  ensureSeeded();

  // Check for PR
  const previousLogs = exerciseLogs.filter(l => l.exercise_name === data.exercise_name);
  const previousMaxE1RM = previousLogs.reduce((max, l) => {
    const e1rm = l.weight_lbs * (1 + l.reps / 30);
    return Math.max(max, e1rm);
  }, 0);

  const newE1RM = data.weight_lbs * (1 + data.reps / 30);
  const isPR = data.weight_lbs > 0 && newE1RM > previousMaxE1RM && previousLogs.length > 0;

  const log: ExerciseLog = {
    id: uuid(),
    ...data,
    is_pr: isPR,
    created_at: new Date().toISOString(),
  };
  exerciseLogs.push(log);

  // Update lifting target current_max if PR
  if (isPR) {
    const target = liftingTargets.find(t => t.exercise_name === data.exercise_name);
    if (target) {
      target.current_max = data.weight_lbs;
      target.updated_at = new Date().toISOString();
    }
  }

  return { ...log, is_pr: isPR };
}

// Nutrition Logs
export function getNutritionLogs(date?: string): NutritionLog[] {
  ensureSeeded();
  if (date) return nutritionLogs.filter(l => l.date === date);
  return [...nutritionLogs].sort((a, b) => b.date.localeCompare(a.date));
}

export function upsertNutritionLog(data: Omit<NutritionLog, 'id' | 'created_at'>): NutritionLog {
  ensureSeeded();
  const idx = nutritionLogs.findIndex(l => l.date === data.date);
  if (idx !== -1) {
    nutritionLogs[idx] = { ...nutritionLogs[idx], ...data };
    return nutritionLogs[idx];
  }
  const log: NutritionLog = {
    id: uuid(),
    ...data,
    created_at: new Date().toISOString(),
  };
  nutritionLogs.push(log);
  return log;
}

// Check-Ins
export function getCheckIns(latest?: boolean): CheckIn[] {
  ensureSeeded();
  const sorted = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));
  if (latest) return sorted.slice(0, 1);
  return sorted;
}

export function createCheckIn(data: Omit<CheckIn, 'id' | 'created_at'>): CheckIn {
  ensureSeeded();
  const ci: CheckIn = {
    id: uuid(),
    ...data,
    created_at: new Date().toISOString(),
  };
  checkIns.push(ci);
  return ci;
}

// Lifting Targets
export function getLiftingTargets(): LiftingTarget[] {
  ensureSeeded();
  return liftingTargets;
}

export function updateLiftingTarget(id: string, data: Partial<LiftingTarget>): LiftingTarget | null {
  ensureSeeded();
  const idx = liftingTargets.findIndex(t => t.id === id);
  if (idx === -1) return null;
  liftingTargets[idx] = { ...liftingTargets[idx], ...data, updated_at: new Date().toISOString() };
  return liftingTargets[idx];
}

// Milestones
export function getMilestones(): Milestone[] {
  ensureSeeded();
  return milestones;
}

export function updateMilestone(id: string, data: Partial<Milestone>): Milestone | null {
  ensureSeeded();
  const idx = milestones.findIndex(m => m.id === id);
  if (idx === -1) return null;
  milestones[idx] = { ...milestones[idx], ...data };
  return milestones[idx];
}

// Dashboard aggregation
export function getDashboardData() {
  ensureSeeded();
  const sessions = [...workoutSessions].sort((a, b) => b.date.localeCompare(a.date));
  const lastSession = sessions[0] || null;
  const recentCheckIns = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));
  const latestWeight = recentCheckIns.find(c => c.weight_lbs)?.weight_lbs || null;

  // This week's sessions
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  const weekStart = startOfWeek.toISOString().split('T')[0];
  const weekSessions = workoutSessions.filter(s => s.date >= weekStart && s.completed);

  return {
    lastSession,
    lastSessionExerciseCount: lastSession ? exerciseLogs.filter(l => l.session_id === lastSession.id).length : 0,
    weeklySessionsCompleted: weekSessions.length,
    latestWeight,
    recentWeights: recentCheckIns
      .filter(c => c.weight_lbs)
      .slice(0, 8)
      .map(c => ({ date: c.date, weight: c.weight_lbs! }))
      .reverse(),
  };
}
