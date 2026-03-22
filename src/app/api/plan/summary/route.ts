import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import { getDayTypeForDate } from '@/lib/utils';
import type { MealPlanEntry, Recipe, WorkoutSession } from '@/types/database';

export const dynamic = 'force-dynamic';

export interface DaySummary {
  date: string;
  workout_type: string;
  meals: { meal_slot: string; recipe_name: string; from_batch: boolean }[];
  macro_total: { calories: number; protein: number; carbs: number; fat: number };
}

export async function GET(request: NextRequest) {
  const start = request.nextUrl.searchParams.get('start');
  const end = request.nextUrl.searchParams.get('end');
  if (!start || !end) {
    return NextResponse.json({ error: 'start and end required' }, { status: 400 });
  }

  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const mealEntries = localStore.getMealPlan(undefined, start, end);
    const recipes = localStore.getRecipes(false);
    const workouts = localStore.getWorkoutSessions();

    const summaries = buildSummaries(start, end, mealEntries, recipes, workouts);
    return NextResponse.json(summaries);
  }

  try {
    const [mealEntries, recipes, workouts] = await Promise.all([
      supabaseFetch<MealPlanEntry[]>(
        `meal_plan?date=gte.${start}&date=lte.${end}&order=date,meal_slot`
      ),
      supabaseFetch<Recipe[]>('recipes'),
      supabaseFetch<WorkoutSession[]>(
        `workout_sessions?date=gte.${start}&date=lte.${end}&order=date`
      ),
    ]);

    const summaries = buildSummaries(start, end, mealEntries, recipes, workouts);
    return NextResponse.json(summaries);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function buildSummaries(
  start: string,
  end: string,
  mealEntries: MealPlanEntry[],
  recipes: Recipe[],
  workouts: WorkoutSession[]
): DaySummary[] {
  const recipeMap = new Map(recipes.map(r => [r.id, r]));
  const workoutMap = new Map(workouts.map(w => [w.date, w]));

  const summaries: DaySummary[] = [];
  const current = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    const dayMeals = mealEntries.filter(m => m.date === dateStr);
    const workout = workoutMap.get(dateStr);

    const meals = dayMeals.map(m => {
      const recipe = recipeMap.get(m.recipe_id);
      return {
        meal_slot: m.meal_slot,
        recipe_name: recipe?.name || 'Unknown',
        from_batch: m.from_batch,
      };
    });

    const macroTotal = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    for (const m of dayMeals) {
      const recipe = recipeMap.get(m.recipe_id);
      if (recipe) {
        macroTotal.calories += (recipe.calories_per_serving || 0) * m.servings;
        macroTotal.protein += (recipe.protein_per_serving || 0) * m.servings;
        macroTotal.carbs += (recipe.carbs_per_serving || 0) * m.servings;
        macroTotal.fat += (recipe.fat_per_serving || 0) * m.servings;
      }
    }

    summaries.push({
      date: dateStr,
      workout_type: workout?.day_type || getDayTypeForDate(current),
      meals,
      macro_total: macroTotal,
    });

    current.setDate(current.getDate() + 1);
  }

  return summaries;
}
