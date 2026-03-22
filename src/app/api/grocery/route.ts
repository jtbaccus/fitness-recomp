import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { GroceryListItem, MealPlanEntry, Recipe, RecipeIngredient, Ingredient } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const weekStart = request.nextUrl.searchParams.get('week_start');
  const listType = request.nextUrl.searchParams.get('list_type');
  if (!weekStart) return NextResponse.json({ error: 'week_start required' }, { status: 400 });

  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getGroceryListItems(weekStart, listType || undefined));
  }

  try {
    let path = `grocery_list_items?week_start=eq.${weekStart}&order=created_at`;
    if (listType) path += `&list_type=eq.${listType}`;
    const data = await supabaseFetch<GroceryListItem[]>(path);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { week_start, list_type } = await request.json();
  if (!week_start || !list_type) {
    return NextResponse.json({ error: 'week_start and list_type required' }, { status: 400 });
  }

  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const items = localStore.generateGroceryList(week_start, list_type);
    return NextResponse.json(items);
  }

  try {
    // Generate grocery list from meal plan on the server side
    const days = list_type === 'weekly' ? 7 : 28;
    const endDate = addDaysStr(week_start, days - 1);

    const entries = await supabaseFetch<MealPlanEntry[]>(
      `meal_plan?date=gte.${week_start}&date=lte.${endDate}&order=date`
    );

    const recipeIds = Array.from(new Set(entries.map(e => e.recipe_id)));
    if (recipeIds.length === 0) return NextResponse.json([]);

    const recipesData = await supabaseFetch<Recipe[]>(
      `recipes?id=in.(${recipeIds.join(',')})`
    );

    const riData = await supabaseFetch<(RecipeIngredient & { ingredients: Ingredient })[]>(
      `recipe_ingredients?recipe_id=in.(${recipeIds.join(',')})&select=*,ingredients(*)`
    );

    // Aggregate
    const agg: Record<string, { ingredient_id: string; quantity: number; unit: string }> = {};

    for (const entry of entries) {
      if (entry.from_batch) continue;
      const recipe = recipesData.find(r => r.id === entry.recipe_id);
      if (!recipe) continue;

      const multiplier = recipe.freezer_friendly ? recipe.batch_yield * entry.servings : entry.servings;
      const ris = riData.filter(ri => ri.recipe_id === recipe.id);

      for (const ri of ris) {
        const ing = ri.ingredients;
        if (!ing) continue;
        if (list_type === 'monthly' && ing.perishable) continue;

        const key = ri.ingredient_id;
        if (!agg[key]) {
          agg[key] = { ingredient_id: ri.ingredient_id, quantity: 0, unit: ri.unit };
        }
        agg[key].quantity += ri.quantity * multiplier;
      }
    }

    // Delete old items
    await supabaseFetch(
      `grocery_list_items?week_start=eq.${week_start}&list_type=eq.${list_type}`,
      { method: 'DELETE' }
    );

    // Insert new
    const newItems = Object.values(agg).map(a => ({
      list_type,
      week_start,
      ingredient_id: a.ingredient_id,
      quantity: Math.round(a.quantity * 100) / 100,
      unit: a.unit,
      checked: false,
    }));

    if (newItems.length === 0) return NextResponse.json([]);

    const saved = await supabaseFetch<GroceryListItem[]>('grocery_list_items', {
      method: 'POST',
      body: newItems,
      headers: { 'Prefer': 'return=representation' },
    });

    return NextResponse.json(saved);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const item = localStore.toggleGroceryItem(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  }

  try {
    // Get current state
    const [current] = await supabaseFetch<GroceryListItem[]>(`grocery_list_items?id=eq.${id}`);
    if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = await supabaseFetch<GroceryListItem[]>(
      `grocery_list_items?id=eq.${id}`,
      { method: 'PATCH', body: { checked: !current.checked }, headers: { 'Prefer': 'return=representation' } }
    );
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function addDaysStr(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
