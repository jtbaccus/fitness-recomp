import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { Recipe } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const include = request.nextUrl.searchParams.get('include');
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getRecipes(include === 'ingredients'));
  }

  try {
    if (include === 'ingredients') {
      // Fetch recipes with joined ingredients
      const recipes = await supabaseFetch<Recipe[]>('recipes?order=meal_slot,name');
      const recipeIngredients = await supabaseFetch<Array<{
        id: string; recipe_id: string; ingredient_id: string; quantity: number; unit: string; notes: string | null;
        ingredients: { id: string; name: string; category: string; default_unit: string; perishable: boolean; storage_type: string };
      }>>('recipe_ingredients?select=*,ingredients(*)');

      const recipesWithIngredients = recipes.map(r => ({
        ...r,
        ingredients: recipeIngredients
          .filter(ri => ri.recipe_id === r.id)
          .map(ri => ({
            id: ri.id,
            recipe_id: ri.recipe_id,
            ingredient_id: ri.ingredient_id,
            quantity: ri.quantity,
            unit: ri.unit,
            notes: ri.notes,
            ingredient: ri.ingredients,
          })),
      }));
      return NextResponse.json(recipesWithIngredients);
    }

    const data = await supabaseFetch<Recipe[]>('recipes?order=meal_slot,name');
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
