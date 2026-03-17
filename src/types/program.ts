export type WorkoutDayType = 'heavy_upper' | 'heavy_lower' | 'upper_hypertrophy' | 'lower_hypertrophy' | 'abs_forearms';

export type NutritionDayType = 'training' | 'work' | 'rest';

export type ProgramPhase = 'foundation' | 'progression' | 'push';

export interface ProgrammedExercise {
  name: string;
  sets: number;
  reps: string; // e.g. "6-10", "12-20", "30-60 sec"
  equipment: string;
  notes?: string;
}

export interface ProgrammedDay {
  dayType: WorkoutDayType;
  label: string;
  duration: string; // e.g. "60-75 min"
  exercises: ProgrammedExercise[];
}

export interface MacroTargets {
  calories: [number, number]; // [min, max]
  protein: number;
  fat: [number, number];
  carbs: [number, number];
}

export interface PhaseDefinition {
  phase: ProgramPhase;
  label: string;
  weekStart: number;
  weekEnd: number;
  goal: string;
}

export interface MilestoneSeed {
  description: string;
  targetWeek: number;
  phase: ProgramPhase;
}

export interface LiftingTargetSeed {
  exerciseName: string;
  estimatedStartMin: number;
  estimatedStartMax: number;
  week4Goal: string;
  week8Goal: string;
  week12Goal: string;
}
