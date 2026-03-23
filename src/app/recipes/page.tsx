'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import RecipeCard from '@/components/recipes/RecipeCard';
import type { Recipe, MealSlot } from '@/types/database';

const SLOT_ORDER: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => {
        setRecipes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const grouped = SLOT_ORDER.map(slot => ({
    slot,
    label: SLOT_LABELS[slot],
    items: recipes.filter(r => r.meal_slot === slot),
  })).filter(g => g.items.length > 0);

  return (
    <PageShell title="Recipes" subtitle="Browse & Cook">
      <Link
        href="/recipes/generate"
        className="block w-full mb-6 py-3 rounded-xl bg-accent text-white text-sm font-medium text-center"
      >
        Create from What I Have
      </Link>

      {loading ? (
        <div className="text-text-muted text-center py-12">Loading recipes...</div>
      ) : grouped.length === 0 ? (
        <div className="text-text-muted text-center py-12">No recipes found.</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <section key={group.slot}>
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.items.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
