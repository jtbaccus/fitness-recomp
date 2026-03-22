'use client';

import type { Recipe, MealSlot } from '@/types/database';

interface DayMealCardProps {
  slot: MealSlot;
  recipe: Recipe | null;
  from_batch: boolean;
  servings: number;
  onSwap: () => void;
}

const slotLabels: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function DayMealCard({ slot, recipe, from_batch, servings, onSwap }: DayMealCardProps) {
  if (!recipe) {
    return (
      <button
        onClick={onSwap}
        className="bg-card rounded-xl p-3 w-full text-left border border-dashed border-border hover:border-accent transition-default"
      >
        <p className="text-xs text-text-muted uppercase tracking-wider">{slotLabels[slot]}</p>
        <p className="text-sm text-text-secondary mt-1">+ Add meal</p>
      </button>
    );
  }

  const cal = (recipe.calories_per_serving || 0) * servings;
  const pro = (recipe.protein_per_serving || 0) * servings;
  const carb = (recipe.carbs_per_serving || 0) * servings;
  const fat = (recipe.fat_per_serving || 0) * servings;

  return (
    <button
      onClick={onSwap}
      className="bg-card rounded-xl p-3 w-full text-left hover:bg-elevated transition-default"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted uppercase tracking-wider">{slotLabels[slot]}</p>
        <div className="flex items-center gap-1.5">
          {from_batch && (
            <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded">Freezer</span>
          )}
          {recipe.prep_time_min && (
            <span className="text-[10px] text-text-muted">{recipe.prep_time_min}m</span>
          )}
        </div>
      </div>
      <p className="text-sm font-medium mt-1">{recipe.name}</p>
      <p className="text-xs text-text-secondary mt-0.5">
        {cal} cal &middot; {pro}g P &middot; {carb}g C &middot; {fat}g F
      </p>
    </button>
  );
}
