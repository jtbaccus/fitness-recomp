'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import DayWorkoutCard from '@/components/plan/DayWorkoutCard';
import DayMealCard from '@/components/plan/DayMealCard';
import DayMacroSummary from '@/components/plan/DayMacroSummary';
import MealSlotPicker from '@/components/plan/MealSlotPicker';
import { formatDate, getDayTypeForDate, getNutritionDayTypeForDate } from '@/lib/utils';
import type { MealPlanEntry, Recipe, MealSlot } from '@/types/database';

const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function DayDetailPage() {
  const params = useParams();
  const dateStr = params.date as string;
  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayType = getDayTypeForDate(dateObj);
  const nutritionDayType = getNutritionDayTypeForDate(dateObj);

  const [mealEntries, setMealEntries] = useState<MealPlanEntry[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<MealSlot | null>(null);

  const recipeMap = new Map(recipes.map(r => [r.id, r]));

  const loadData = useCallback(() => {
    Promise.all([
      fetch(`/api/meal-plan?date=${dateStr}`).then(r => r.json()),
      fetch('/api/recipes').then(r => r.json()),
      fetch(`/api/workouts?date=${dateStr}`).then(r => r.json()),
    ]).then(([meals, recs, workouts]) => {
      setMealEntries(meals);
      setRecipes(recs);
      setWorkoutCompleted(workouts.some((w: { completed: boolean }) => w.completed));
    }).catch(console.error);
  }, [dateStr]);

  useEffect(() => { loadData(); }, [loadData]);

  // Compute macro totals from planned meals
  const macroTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (const entry of mealEntries) {
    const recipe = recipeMap.get(entry.recipe_id);
    if (recipe) {
      macroTotals.calories += (recipe.calories_per_serving || 0) * entry.servings;
      macroTotals.protein += (recipe.protein_per_serving || 0) * entry.servings;
      macroTotals.carbs += (recipe.carbs_per_serving || 0) * entry.servings;
      macroTotals.fat += (recipe.fat_per_serving || 0) * entry.servings;
    }
  }

  const handleSwapMeal = async (recipeId: string) => {
    if (!pickerSlot) return;

    // Remove existing entry for this slot
    const existing = mealEntries.find(m => m.meal_slot === pickerSlot);
    if (existing) {
      await fetch(`/api/meal-plan?id=${existing.id}`, { method: 'DELETE' });
    }

    // Add new entry
    await fetch('/api/meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: dateStr,
        meal_slot: pickerSlot,
        recipe_id: recipeId,
        servings: 1,
        from_batch: false,
      }),
    });

    setPickerSlot(null);
    loadData();
  };

  // Navigate to previous/next day
  const prevDate = new Date(dateObj);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(dateObj);
  nextDate.setDate(nextDate.getDate() + 1);
  const prevStr = prevDate.toISOString().split('T')[0];
  const nextStr = nextDate.toISOString().split('T')[0];

  return (
    <PageShell title={formatDate(dateStr)} subtitle={dateStr}>
      <div className="space-y-4">
        {/* Day nav */}
        <div className="flex items-center justify-between">
          <Link href={`/plan/day/${prevStr}`} className="text-sm text-accent">← Prev</Link>
          <Link href="/plan" className="text-xs text-text-muted">Back to Calendar</Link>
          <Link href={`/plan/day/${nextStr}`} className="text-sm text-accent">Next →</Link>
        </div>

        <DayWorkoutCard dayType={dayType} completed={workoutCompleted} />

        {/* Meal slots */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Meals</h3>
          {MEAL_SLOTS.map(slot => {
            const entry = mealEntries.find(m => m.meal_slot === slot);
            const recipe = entry ? recipeMap.get(entry.recipe_id) || null : null;
            return (
              <DayMealCard
                key={slot}
                slot={slot}
                recipe={recipe}
                from_batch={entry?.from_batch || false}
                servings={entry?.servings || 1}
                onSwap={() => setPickerSlot(slot)}
              />
            );
          })}
        </div>

        <DayMacroSummary dayType={nutritionDayType} totals={macroTotals} />
      </div>

      {pickerSlot && (
        <MealSlotPicker
          slot={pickerSlot}
          currentRecipeId={mealEntries.find(m => m.meal_slot === pickerSlot)?.recipe_id || null}
          onSelect={handleSwapMeal}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </PageShell>
  );
}
