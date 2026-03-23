'use client';

import { useState, useEffect } from 'react';
import type { MealSlot } from '@/types/database';

interface Suggestion {
  recipe_id: string | null;
  name: string;
  reason: string;
  macros: { calories: number; protein: number; carbs: number; fat: number };
}

interface AIMealSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  mealSlot: MealSlot;
  currentRecipeId: string;
  onSwap: (recipeId: string) => void;
}

const slotLabels: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function AIMealSwapModal({
  isOpen,
  onClose,
  date,
  mealSlot,
  currentRecipeId,
  onSwap,
}: AIMealSwapModalProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch('/api/ai/meal-swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        meal_slot: mealSlot,
        current_recipe_id: currentRecipeId,
      }),
    })
      .then(r => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        return r.json();
      })
      .then(data => {
        setSuggestions(data.suggestions || []);
      })
      .catch(err => {
        console.error('AI meal swap error:', err);
        setError('Failed to get suggestions. Try again.');
      })
      .finally(() => setLoading(false));
  }, [isOpen, date, mealSlot, currentRecipeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-elevated rounded-t-2xl max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">&#10024;</span>
            <h3 className="font-semibold text-sm">AI Swap &mdash; {slotLabels[mealSlot]}</h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white text-sm">
            Close
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {loading && (
            <>
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-xl p-3 animate-pulse">
                  <div className="h-4 bg-border rounded w-3/4 mb-2" />
                  <div className="h-3 bg-border rounded w-full mb-1.5" />
                  <div className="h-3 bg-border rounded w-1/2" />
                </div>
              ))}
            </>
          )}

          {error && (
            <div className="bg-card rounded-xl p-4 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => {
                  // Re-trigger by toggling
                  setSuggestions([]);
                  setLoading(true);
                  setError(null);
                  fetch('/api/ai/meal-swap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      date,
                      meal_slot: mealSlot,
                      current_recipe_id: currentRecipeId,
                    }),
                  })
                    .then(r => r.json())
                    .then(data => setSuggestions(data.suggestions || []))
                    .catch(() => setError('Still failing. Check your connection.'))
                    .finally(() => setLoading(false));
                }}
                className="mt-2 text-xs text-accent hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <div className="bg-card rounded-xl p-4 text-center">
              <p className="text-sm text-text-secondary">No suggestions available for this slot.</p>
            </div>
          )}

          {!loading && suggestions.map((s, idx) => {
            const hasRecipe = !!s.recipe_id;
            return (
              <div key={idx} className="bg-card rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{s.reason}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      {s.macros.calories} cal &middot; {s.macros.protein}g P &middot; {s.macros.carbs}g C &middot; {s.macros.fat}g F
                    </p>
                  </div>
                  {hasRecipe ? (
                    <button
                      onClick={() => onSwap(s.recipe_id!)}
                      className="shrink-0 text-xs font-medium bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent/80 transition-default"
                    >
                      Use This
                    </button>
                  ) : (
                    <span className="shrink-0 text-[10px] text-text-muted bg-border/50 px-2 py-1 rounded">
                      Custom &mdash; coming soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
