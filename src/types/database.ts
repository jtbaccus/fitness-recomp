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

// Meal Planning Types

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type IngredientCategory = 'produce' | 'protein' | 'dairy' | 'grains' | 'pantry' | 'frozen' | 'condiment';
export type StorageType = 'pantry' | 'fridge' | 'freezer';

export interface Recipe {
  id: string;
  name: string;
  meal_slot: MealSlot;
  servings: number;
  calories_per_serving: number | null;
  protein_per_serving: number | null;
  carbs_per_serving: number | null;
  fat_per_serving: number | null;
  prep_time_min: number | null;
  freezer_friendly: boolean;
  batch_yield: number;
  notes: string | null;
  created_at: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  default_unit: string;
  perishable: boolean;
  storage_type: StorageType;
  created_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes: string | null;
}

export interface MealPlanEntry {
  id: string;
  date: string;
  meal_slot: MealSlot;
  recipe_id: string;
  servings: number;
  from_batch: boolean;
  notes: string | null;
  created_at: string;
}

export interface GroceryListItem {
  id: string;
  list_type: 'weekly' | 'monthly';
  week_start: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  checked: boolean;
  created_at: string;
}
