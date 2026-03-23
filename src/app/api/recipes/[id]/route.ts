import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { Recipe } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const include = request.nextUrl.searchParams.get('include');
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const recipe = localStore.getRecipeById(id, include === 'ingredients');
    if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(recipe);
  }

  try {
    const recipes = await supabaseFetch<Recipe[]>(`recipes?id=eq.${id}`);
    if (recipes.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const recipe = recipes[0];

    if (include === 'ingredients') {
      const recipeIngredients = await supabaseFetch<Array<{
        id: string; recipe_id: string; ingredient_id: string; quantity: number; unit: string; notes: string | null;
        ingredients: { id: string; name: string; category: string; default_unit: string; perishable: boolean; storage_type: string };
      }>>(`recipe_ingredients?recipe_id=eq.${id}&select=*,ingredients(*)`);

      return NextResponse.json({
        ...recipe,
        ingredients: recipeIngredients.map(ri => ({
          id: ri.id,
          recipe_id: ri.recipe_id,
          ingredient_id: ri.ingredient_id,
          quantity: ri.quantity,
          unit: ri.unit,
          notes: ri.notes,
          ingredient: ri.ingredients,
        })),
      });
    }

    return NextResponse.json(recipe);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
