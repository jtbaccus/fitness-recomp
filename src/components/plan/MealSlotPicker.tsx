'use client';

import { useState, useEffect } from 'react';
import type { Recipe, MealSlot } from '@/types/database';

interface MealSlotPickerProps {
  slot: MealSlot;
  currentRecipeId: string | null;
  onSelect: (recipeId: string) => void;
  onClose: () => void;
}

const slotLabels: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function MealSlotPicker({ slot, currentRecipeId, onSelect, onClose }: MealSlotPickerProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetch('/api/recipes')
      .then(r => r.json())
      .then((all: Recipe[]) => {
        // Show recipes for this slot, plus all others at the bottom
        const forSlot = all.filter(r => r.meal_slot === slot);
        const other = all.filter(r => r.meal_slot !== slot);
        setRecipes([...forSlot, ...other]);
      })
      .catch(console.error);
  }, [slot]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-t-2xl max-h-[70vh] flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm">Pick {slotLabels[slot]}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-white text-sm">Close</button>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {recipes.map(recipe => {
            const isCurrent = recipe.id === currentRecipeId;
            const isSlotMatch = recipe.meal_slot === slot;
            return (
              <button
                key={recipe.id}
                onClick={() => onSelect(recipe.id)}
                className={`w-full text-left p-3 rounded-xl mb-1 transition-default ${
                  isCurrent ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-elevated'
                } ${!isSlotMatch ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{recipe.name}</span>
                  <div className="flex items-center gap-1.5">
                    {recipe.freezer_friendly && (
                      <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded">Batch x{recipe.batch_yield}</span>
                    )}
                    {!isSlotMatch && (
                      <span className="text-[10px] text-text-muted">{recipe.meal_slot}</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  {recipe.calories_per_serving} cal &middot; {recipe.protein_per_serving}g P &middot; {recipe.carbs_per_serving}g C &middot; {recipe.fat_per_serving}g F
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
