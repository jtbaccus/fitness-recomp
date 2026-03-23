import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { Recipe, MealSlot, IngredientCategory, StorageType } from '@/types/database';

export const dynamic = 'force-dynamic';

interface RecipeIngredientInput {
  name: string;
  quantity: number;
  unit: string;
}

interface CreateRecipeBody {
  name: string;
  meal_slot: MealSlot;
  servings: number;
  calories_per_serving: number | null;
  protein_per_serving: number | null;
  carbs_per_serving: number | null;
  fat_per_serving: number | null;
  prep_time_min: number | null;
  freezer_friendly?: boolean;
  batch_yield?: number;
  notes: string | null;
  instructions: string | null;
  ingredients: RecipeIngredientInput[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateRecipeBody;

    if (!body.name || !body.meal_slot) {
      return NextResponse.json(
        { error: 'name and meal_slot are required' },
        { status: 400 }
      );
    }

    const { isConfigured } = getSupabaseConfig();

    if (isConfigured) {
      // Insert the recipe
      const [savedRecipe] = await supabaseFetch<Recipe[]>('recipes', {
        method: 'POST',
        body: {
          name: body.name,
          meal_slot: body.meal_slot,
          servings: body.servings || 1,
          calories_per_serving: body.calories_per_serving,
          protein_per_serving: body.protein_per_serving,
          carbs_per_serving: body.carbs_per_serving,
          fat_per_serving: body.fat_per_serving,
          prep_time_min: body.prep_time_min,
          freezer_friendly: body.freezer_friendly ?? false,
          batch_yield: body.batch_yield ?? 1,
          notes: body.notes,
          instructions: body.instructions,
        },
        headers: { 'Prefer': 'return=representation' },
      });

      // Process each ingredient
      if (body.ingredients && body.ingredients.length > 0) {
        for (const ing of body.ingredients) {
          // Check if ingredient exists by name
          const existing = await supabaseFetch<{ id: string }[]>(
            `ingredients?name=eq.${encodeURIComponent(ing.name)}&select=id`
          );

          let ingredientId: string;
          if (existing.length > 0) {
            ingredientId = existing[0].id;
          } else {
            // Insert new ingredient with sensible defaults
            const [newIng] = await supabaseFetch<{ id: string }[]>('ingredients', {
              method: 'POST',
              body: {
                name: ing.name,
                category: 'pantry' as IngredientCategory,
                default_unit: ing.unit,
                perishable: true,
                storage_type: 'fridge' as StorageType,
              },
              headers: { 'Prefer': 'return=representation' },
            });
            ingredientId = newIng.id;
          }

          // Insert recipe_ingredient junction row
          await supabaseFetch('recipe_ingredients', {
            method: 'POST',
            body: {
              recipe_id: savedRecipe.id,
              ingredient_id: ingredientId,
              quantity: ing.quantity,
              unit: ing.unit,
              notes: null,
            },
          });
        }
      }

      return NextResponse.json(savedRecipe, { status: 201 });
    }

    // Local store fallback
    const savedRecipe = localStore.createRecipe({
      name: body.name,
      meal_slot: body.meal_slot,
      servings: body.servings || 1,
      calories_per_serving: body.calories_per_serving,
      protein_per_serving: body.protein_per_serving,
      carbs_per_serving: body.carbs_per_serving,
      fat_per_serving: body.fat_per_serving,
      prep_time_min: body.prep_time_min,
      freezer_friendly: body.freezer_friendly ?? false,
      batch_yield: body.batch_yield ?? 1,
      notes: body.notes,
      instructions: body.instructions,
    });

    // Process ingredients for local store
    if (body.ingredients && body.ingredients.length > 0) {
      for (const ing of body.ingredients) {
        // Check if ingredient exists
        const allIngredients = localStore.getIngredients();
        let existing = allIngredients.find(
          i => i.name.toLowerCase() === ing.name.toLowerCase()
        );

        if (!existing) {
          existing = localStore.createIngredient({
            name: ing.name,
            category: 'pantry',
            default_unit: ing.unit,
            perishable: true,
            storage_type: 'fridge',
          });
        }

        localStore.createRecipeIngredient({
          recipe_id: savedRecipe.id,
          ingredient_id: existing.id,
          quantity: ing.quantity,
          unit: ing.unit,
          notes: null,
        });
      }
    }

    return NextResponse.json(savedRecipe, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

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
