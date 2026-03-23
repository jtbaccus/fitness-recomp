import Link from 'next/link';
import type { Recipe, MealSlot } from '@/types/database';

const SLOT_COLORS: Record<MealSlot, string> = {
  breakfast: 'bg-amber-600/20 text-amber-400',
  lunch: 'bg-green-600/20 text-green-400',
  dinner: 'bg-indigo-600/20 text-indigo-400',
  snack: 'bg-purple-600/20 text-purple-400',
};

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const cal = recipe.calories_per_serving ?? 0;
  const p = recipe.protein_per_serving ?? 0;
  const c = recipe.carbs_per_serving ?? 0;
  const f = recipe.fat_per_serving ?? 0;

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <div className="bg-card rounded-xl p-4 hover:bg-elevated transition-colors">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white leading-tight">{recipe.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${SLOT_COLORS[recipe.meal_slot]}`}>
            {recipe.meal_slot}
          </span>
        </div>

        <p className="text-xs text-text-muted mb-2">
          {cal} cal &middot; {p}g P &middot; {c}g C &middot; {f}g F
        </p>

        <div className="flex items-center gap-3 text-xs text-text-secondary">
          {recipe.prep_time_min != null && (
            <span>{recipe.prep_time_min} min prep</span>
          )}
          {recipe.freezer_friendly && (
            <span className="bg-elevated text-xs px-2 py-0.5 rounded-full">Freezer-friendly</span>
          )}
        </div>
      </div>
    </Link>
  );
}
