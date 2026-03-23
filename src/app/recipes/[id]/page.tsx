'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageShell from '@/components/PageShell';
import IngredientList from '@/components/recipes/IngredientList';
import { generateRecipePDF } from '@/lib/recipe-pdf';
import type { Recipe, RecipeIngredient, Ingredient, MealPlanEntry, MealSlot } from '@/types/database';

type RecipeWithIngredients = Recipe & {
  ingredients?: (RecipeIngredient & { ingredient?: Ingredient })[];
};

const SLOT_COLORS: Record<MealSlot, string> = {
  breakfast: 'bg-amber-600/20 text-amber-400',
  lunch: 'bg-green-600/20 text-green-400',
  dinner: 'bg-indigo-600/20 text-indigo-400',
  snack: 'bg-purple-600/20 text-purple-400',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeWithIngredients | null>(null);
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`/api/recipes/${id}?include=ingredients`).then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      }),
      fetch('/api/meal-plan').then(res => res.json()),
    ])
      .then(([recipeData, mealPlanData]: [RecipeWithIngredients, MealPlanEntry[]]) => {
        setRecipe(recipeData);

        // Find which days of week this recipe appears
        const entries = Array.isArray(mealPlanData)
          ? mealPlanData.filter(e => e.recipe_id === id)
          : [];
        const daySet = new Set<string>();
        for (const entry of entries) {
          const dow = new Date(entry.date + 'T00:00:00').getDay();
          daySet.add(DAY_NAMES[dow]);
        }
        setScheduleDays(
          DAY_NAMES.filter(d => daySet.has(d))
        );
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <PageShell title="Recipe">
        <div className="text-text-muted text-center py-12">Loading...</div>
      </PageShell>
    );
  }

  if (error || !recipe) {
    return (
      <PageShell title="Recipe">
        <div className="text-text-muted text-center py-12">Recipe not found.</div>
        <Link href="/recipes" className="block text-center text-accent text-sm mt-4">
          &larr; Back to Recipes
        </Link>
      </PageShell>
    );
  }

  const cal = recipe.calories_per_serving ?? 0;
  const protein = recipe.protein_per_serving ?? 0;
  const carbs = recipe.carbs_per_serving ?? 0;
  const fat = recipe.fat_per_serving ?? 0;

  const instructionSteps = recipe.instructions
    ? recipe.instructions.split('\n').filter(s => s.trim())
    : [];

  return (
    <PageShell title={recipe.name}>
      {/* Back link + Export */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/recipes" className="text-accent text-sm">
          &larr; Back to Recipes
        </Link>
        <button
          onClick={() => generateRecipePDF(recipe)}
          className="text-xs text-white bg-elevated px-3 py-1 rounded-lg font-medium"
        >
          Export PDF
        </button>
      </div>

      {/* Header badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-0.5 rounded-full ${SLOT_COLORS[recipe.meal_slot]}`}>
          {recipe.meal_slot}
        </span>
        {recipe.prep_time_min != null && (
          <span className="bg-elevated text-xs px-2 py-0.5 rounded-full text-text-secondary">
            {recipe.prep_time_min} min prep
          </span>
        )}
        {recipe.freezer_friendly && (
          <span className="bg-elevated text-xs px-2 py-0.5 rounded-full text-text-secondary">
            Freezer-friendly
          </span>
        )}
      </div>

      {/* Macros */}
      <div className="bg-card rounded-xl p-4 mb-4">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Macros per Serving
        </h2>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-white">{cal}</div>
            <div className="text-xs text-text-muted">cal</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent">{protein}g</div>
            <div className="text-xs text-text-muted">protein</div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber">{carbs}g</div>
            <div className="text-xs text-text-muted">carbs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">{fat}g</div>
            <div className="text-xs text-text-muted">fat</div>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-card rounded-xl p-4 mb-4">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Ingredients
        </h2>
        <IngredientList ingredients={recipe.ingredients ?? []} />
      </div>

      {/* Instructions */}
      <div className="bg-card rounded-xl p-4 mb-4">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Instructions
        </h2>
        {instructionSteps.length > 0 ? (
          <ol className="space-y-2">
            {instructionSteps.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span className="text-text-muted flex-shrink-0 w-5 text-right">{idx + 1}.</span>
                <span className="text-white">{step}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-text-muted text-sm">No instructions yet.</p>
        )}
      </div>

      {/* Batch Cooking */}
      {recipe.freezer_friendly && (
        <div className="bg-card rounded-xl p-4 mb-4">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Batch Cooking
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Batch yield</span>
              <span className="text-white">{recipe.batch_yield} servings</span>
            </div>
            {recipe.notes && (
              <p className="text-text-muted text-xs mt-2">{recipe.notes}</p>
            )}
          </div>
        </div>
      )}

      {/* Schedule */}
      {scheduleDays.length > 0 && (
        <div className="bg-card rounded-xl p-4 mb-4">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Appears on
          </h2>
          <div className="flex flex-wrap gap-2">
            {scheduleDays.map(day => (
              <span
                key={day}
                className="bg-elevated text-xs px-3 py-1 rounded-full text-white"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
