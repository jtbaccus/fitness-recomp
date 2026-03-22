// In-memory dev fallback when Supabase is not configured
// Auto-seeds milestones and lifting targets on first access

import type { WorkoutSession, ExerciseLog, NutritionLog, CheckIn, LiftingTarget, Milestone, Recipe, Ingredient, RecipeIngredient, MealPlanEntry, GroceryListItem } from '@/types/database';
import { SEED_MILESTONES, SEED_LIFTING_TARGETS, PROGRAM_START_DATE } from './program-config';
import { SEED_RECIPES, SEED_INGREDIENTS, WEEKLY_MEAL_TEMPLATE } from './meal-seed-data';

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
let recipes: Recipe[] = [];
let ingredients: Ingredient[] = [];
const recipeIngredients: RecipeIngredient[] = [];
const mealPlanEntries: MealPlanEntry[] = [];
let groceryListItems: GroceryListItem[] = [];
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

  // Seed ingredients
  ingredients = SEED_INGREDIENTS.map(i => ({
    id: uuid(),
    name: i.name,
    category: i.category,
    default_unit: i.default_unit,
    perishable: i.perishable,
    storage_type: i.storage_type,
    created_at: new Date().toISOString(),
  }));

  // Seed recipes and recipe_ingredients
  recipes = SEED_RECIPES.map(r => {
    const recipeId = uuid();
    // Create recipe_ingredients for this recipe
    for (const ri of r.ingredients) {
      const ing = ingredients.find(i => i.name === ri.ingredientName);
      if (ing) {
        recipeIngredients.push({
          id: uuid(),
          recipe_id: recipeId,
          ingredient_id: ing.id,
          quantity: ri.quantity,
          unit: ri.unit,
          notes: ri.notes || null,
        });
      }
    }
    return {
      id: recipeId,
      name: r.name,
      meal_slot: r.meal_slot,
      servings: r.servings,
      calories_per_serving: r.calories_per_serving,
      protein_per_serving: r.protein_per_serving,
      carbs_per_serving: r.carbs_per_serving,
      fat_per_serving: r.fat_per_serving,
      prep_time_min: r.prep_time_min,
      freezer_friendly: r.freezer_friendly,
      batch_yield: r.batch_yield,
      notes: r.notes,
      created_at: new Date().toISOString(),
    };
  });

  // Seed 12-week meal plan from weekly template
  const startDate = new Date(PROGRAM_START_DATE + 'T00:00:00');
  for (let week = 0; week < 12; week++) {
    for (let day = 0; day < 7; day++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + week * 7 + day);
      const dateStr = d.toISOString().split('T')[0];
      const dow = d.getDay();
      const template = WEEKLY_MEAL_TEMPLATE.find(t => t.dayOfWeek === dow);
      if (!template) continue;
      for (const meal of template.meals) {
        const recipe = recipes.find(r => r.name === meal.recipeName);
        if (!recipe) continue;
        mealPlanEntries.push({
          id: uuid(),
          date: dateStr,
          meal_slot: meal.slot,
          recipe_id: recipe.id,
          servings: 1,
          from_batch: meal.from_batch,
          notes: null,
          created_at: new Date().toISOString(),
        });
      }
    }
  }
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

// Recipes
export function getRecipes(includeIngredients?: boolean): (Recipe & { ingredients?: (RecipeIngredient & { ingredient?: Ingredient })[] })[] {
  ensureSeeded();
  if (!includeIngredients) return recipes;
  return recipes.map(r => ({
    ...r,
    ingredients: recipeIngredients
      .filter(ri => ri.recipe_id === r.id)
      .map(ri => ({
        ...ri,
        ingredient: ingredients.find(i => i.id === ri.ingredient_id),
      })),
  }));
}

export function getRecipeById(id: string): Recipe | null {
  ensureSeeded();
  return recipes.find(r => r.id === id) || null;
}

// Ingredients
export function getIngredients(): Ingredient[] {
  ensureSeeded();
  return ingredients;
}

export function getIngredientById(id: string): Ingredient | null {
  ensureSeeded();
  return ingredients.find(i => i.id === id) || null;
}

// Recipe Ingredients
export function getRecipeIngredients(recipeId: string): RecipeIngredient[] {
  ensureSeeded();
  return recipeIngredients.filter(ri => ri.recipe_id === recipeId);
}

// Meal Plan
export function getMealPlan(date?: string, startDate?: string, endDate?: string): MealPlanEntry[] {
  ensureSeeded();
  let results = mealPlanEntries;
  if (date) results = results.filter(m => m.date === date);
  if (startDate) results = results.filter(m => m.date >= startDate);
  if (endDate) results = results.filter(m => m.date <= endDate);
  return results.sort((a, b) => a.date.localeCompare(b.date));
}

export function createMealPlanEntry(data: Omit<MealPlanEntry, 'id' | 'created_at'>): MealPlanEntry {
  ensureSeeded();
  const entry: MealPlanEntry = {
    id: uuid(),
    ...data,
    created_at: new Date().toISOString(),
  };
  mealPlanEntries.push(entry);
  return entry;
}

export function deleteMealPlanEntry(id: string): boolean {
  ensureSeeded();
  const idx = mealPlanEntries.findIndex(m => m.id === id);
  if (idx === -1) return false;
  mealPlanEntries.splice(idx, 1);
  return true;
}

// Grocery List Items
export function getGroceryListItems(weekStart: string, listType?: string): GroceryListItem[] {
  ensureSeeded();
  let results = groceryListItems.filter(g => g.week_start === weekStart);
  if (listType) results = results.filter(g => g.list_type === listType);
  return results;
}

export function generateGroceryList(weekStart: string, listType: 'weekly' | 'monthly'): GroceryListItem[] {
  ensureSeeded();
  const days = listType === 'weekly' ? 7 : 28;
  const endDate = addDays(weekStart, days - 1);

  // Get meal plan entries in range
  const entries = mealPlanEntries.filter(m => m.date >= weekStart && m.date <= endDate);

  // Aggregate ingredients
  const agg: Record<string, { ingredient_id: string; quantity: number; unit: string }> = {};

  for (const entry of entries) {
    if (entry.from_batch) continue; // Skip batch meals — already in freezer

    const recipe = recipes.find(r => r.id === entry.recipe_id);
    if (!recipe) continue;

    // For freezer-friendly recipes that are NOT from_batch, we cook the full batch
    const multiplier = recipe.freezer_friendly ? recipe.batch_yield * entry.servings : entry.servings;

    const ris = recipeIngredients.filter(ri => ri.recipe_id === recipe.id);
    for (const ri of ris) {
      const ing = ingredients.find(i => i.id === ri.ingredient_id);
      if (!ing) continue;

      // Monthly list: only non-perishable
      if (listType === 'monthly' && ing.perishable) continue;

      const key = ri.ingredient_id;
      if (!agg[key]) {
        agg[key] = { ingredient_id: ri.ingredient_id, quantity: 0, unit: ri.unit };
      }
      agg[key].quantity += ri.quantity * multiplier;
    }
  }

  // Remove old items for this week/type
  groceryListItems = groceryListItems.filter(
    g => !(g.week_start === weekStart && g.list_type === listType)
  );

  // Create new items
  const newItems: GroceryListItem[] = Object.values(agg).map(a => ({
    id: uuid(),
    list_type: listType,
    week_start: weekStart,
    ingredient_id: a.ingredient_id,
    quantity: Math.round(a.quantity * 100) / 100,
    unit: a.unit,
    checked: false,
    created_at: new Date().toISOString(),
  }));

  groceryListItems.push(...newItems);
  return newItems;
}

export function toggleGroceryItem(id: string): GroceryListItem | null {
  ensureSeeded();
  const idx = groceryListItems.findIndex(g => g.id === id);
  if (idx === -1) return null;
  groceryListItems[idx] = { ...groceryListItems[idx], checked: !groceryListItems[idx].checked };
  return groceryListItems[idx];
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
