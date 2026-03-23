import type { RecipeIngredient, Ingredient } from '@/types/database';

type IngredientEntry = RecipeIngredient & { ingredient?: Ingredient };

export default function IngredientList({ ingredients }: { ingredients: IngredientEntry[] }) {
  if (ingredients.length === 0) {
    return <p className="text-text-muted text-sm">No ingredients listed.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {ingredients.map((item, idx) => (
        <li key={item.id} className="flex items-baseline gap-3 py-2">
          <span className="text-text-muted text-xs w-5 text-right flex-shrink-0">{idx + 1}.</span>
          <span className="text-white text-sm">
            <span className="text-text-secondary">{item.quantity} {item.unit}</span>
            {' '}
            {item.ingredient?.name ?? 'Unknown ingredient'}
          </span>
          {item.notes && (
            <span className="text-text-muted text-xs ml-auto">({item.notes})</span>
          )}
        </li>
      ))}
    </ul>
  );
}
