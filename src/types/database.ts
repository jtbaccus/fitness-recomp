export interface WorkoutSession {
  id: string;
  date: string;
  day_type: string;
  duration_min: number | null;
  notes: string | null;
  completed: boolean;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  session_id: string;
  exercise_name: string;
  set_number: number;
  weight_lbs: number;
  reps: number;
  rpe: number | null;
  is_pr: boolean;
  created_at: string;
}

export interface NutritionLog {
  id: string;
  date: string;
  day_type: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  notes: string | null;
  created_at: string;
}

export interface CheckIn {
  id: string;
  date: string;
  weight_lbs: number | null;
  waist_inches: number | null;
  sleep_score: number | null;
  energy_score: number | null;
  compliance_score: number | null;
  notes: string | null;
  created_at: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  photo_type: string;
  storage_path: string;
  created_at: string;
}

export interface LiftingTarget {
  id: string;
  exercise_name: string;
  baseline_weight: number | null;
  baseline_reps: number | null;
  week4_goal: string | null;
  week8_goal: string | null;
  week12_goal: string | null;
  current_max: number | null;
  updated_at: string;
}

export interface Milestone {
  id: string;
  description: string;
  target_date: string | null;
  phase: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}
