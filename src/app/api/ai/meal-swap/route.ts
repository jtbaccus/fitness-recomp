import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getAIModel, isAIConfigured } from '@/lib/ai-config';
import { MEAL_SWAP_PROMPT, getMacroContext, getDayTypeFromDow } from '@/lib/ai-prompts';
import { MACRO_TARGETS } from '@/lib/program-config';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { Recipe, MealPlanEntry, MealSlot } from '@/types/database';

export const dynamic = 'force-dynamic';

interface Suggestion {
  recipe_id: string | null;
  name: string;
  reason: string;
  macros: { calories: number; protein: number; carbs: number; fat: number };
}

export async function POST(request: NextRequest) {
  try {
    const { date, meal_slot, current_recipe_id } = await request.json() as {
      date: string;
      meal_slot: MealSlot;
      current_recipe_id: string;
    };

    if (!date || !meal_slot || !current_recipe_id) {
      return NextResponse.json(
        { error: 'date, meal_slot, and current_recipe_id are required' },
        { status: 400 }
      );
    }

    // Determine day type from date
    const dateObj = new Date(date + 'T00:00:00');
    const dow = dateObj.getDay();
    const dayType = getDayTypeFromDow(dow);
    const targets = MACRO_TARGETS[dayType];

    // Fetch all recipes and current day meals
    const { isConfigured } = getSupabaseConfig();
    let allRecipes: Recipe[];
    let dayMeals: MealPlanEntry[];

    if (isConfigured) {
      [allRecipes, dayMeals] = await Promise.all([
        supabaseFetch<Recipe[]>('recipes?order=meal_slot,name'),
        supabaseFetch<MealPlanEntry[]>(`meal_plan?date=eq.${date}&order=meal_slot`),
      ]);
    } else {
      allRecipes = localStore.getRecipes();
      dayMeals = localStore.getMealPlan(date);
    }

    // Build recipe lookup for current meals context
    const recipeMap = new Map(allRecipes.map(r => [r.id, r]));

    // If AI is configured, use it
    if (isAIConfigured()) {
      const model = getAIModel();
      if (model) {
        const suggestions = await getAISuggestions(
          model, meal_slot, dayType, targets, current_recipe_id,
          dayMeals, allRecipes, recipeMap
        );
        return NextResponse.json({ suggestions });
      }
    }

    // Fallback: deterministic macro-proximity ranking
    const suggestions = getFallbackSuggestions(
      meal_slot, current_recipe_id, dayMeals, allRecipes, recipeMap, targets
    );
    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error('AI meal swap error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

async function getAISuggestions(
  model: ReturnType<typeof getAIModel> & object,
  mealSlot: MealSlot,
  dayType: string,
  targets: typeof MACRO_TARGETS['training'],
  currentRecipeId: string,
  dayMeals: MealPlanEntry[],
  allRecipes: Recipe[],
  recipeMap: Map<string, Recipe>
): Promise<Suggestion[]> {
  const macroContext = getMacroContext(dayType as 'training' | 'work');

  // Build current meals summary
  const currentMealLines = dayMeals.map(m => {
    const r = recipeMap.get(m.recipe_id);
    if (!r) return `${m.meal_slot}: (unknown recipe)`;
    return `${m.meal_slot}: ${r.name} (${r.calories_per_serving} cal, ${r.protein_per_serving}g P, ${r.carbs_per_serving}g C, ${r.fat_per_serving}g F)`;
  }).join('\n');

  // Build available recipes list (just slot-matching ones plus a few others)
  const slotRecipes = allRecipes.filter(r => r.meal_slot === mealSlot && r.id !== currentRecipeId);
  const recipeLines = slotRecipes.map(r =>
    `- id:${r.id} | ${r.name} | ${r.calories_per_serving} cal, ${r.protein_per_serving}g P, ${r.carbs_per_serving}g C, ${r.fat_per_serving}g F`
  ).join('\n');

  const userMessage = `Meal slot to replace: ${mealSlot}
Current recipe being swapped out: ${recipeMap.get(currentRecipeId)?.name || 'Unknown'}

${macroContext}
Target ranges: ${targets.calories[0]}-${targets.calories[1]} cal, ${targets.protein}g protein, ${targets.carbs[0]}-${targets.carbs[1]}g carbs, ${targets.fat[0]}-${targets.fat[1]}g fat

Current meals for the day:
${currentMealLines || '(no other meals planned)'}

Available recipes for ${mealSlot}:
${recipeLines || '(none available)'}`;

  const result = await generateText({
    model,
    system: MEAL_SWAP_PROMPT,
    prompt: userMessage,
  });

  // Parse the JSON response
  try {
    const parsed = JSON.parse(result.text);
    if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
      return parsed.suggestions.slice(0, 3);
    }
  } catch {
    console.error('Failed to parse AI response:', result.text);
  }

  // If AI response parsing fails, fall back
  return [];
}

function getFallbackSuggestions(
  mealSlot: MealSlot,
  currentRecipeId: string,
  dayMeals: MealPlanEntry[],
  allRecipes: Recipe[],
  recipeMap: Map<string, Recipe>,
  targets: typeof MACRO_TARGETS['training']
): Suggestion[] {
  // Calculate current day totals excluding the meal being swapped
  const otherMeals = dayMeals.filter(m => m.meal_slot !== mealSlot);
  const currentTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (const m of otherMeals) {
    const r = recipeMap.get(m.recipe_id);
    if (r) {
      currentTotals.calories += (r.calories_per_serving || 0) * m.servings;
      currentTotals.protein += (r.protein_per_serving || 0) * m.servings;
      currentTotals.carbs += (r.carbs_per_serving || 0) * m.servings;
      currentTotals.fat += (r.fat_per_serving || 0) * m.servings;
    }
  }

  // Ideal remaining macros for this slot
  const idealCal = ((targets.calories[0] + targets.calories[1]) / 2) - currentTotals.calories;
  const idealPro = targets.protein - currentTotals.protein;
  const idealCarbs = ((targets.carbs[0] + targets.carbs[1]) / 2) - currentTotals.carbs;
  const idealFat = ((targets.fat[0] + targets.fat[1]) / 2) - currentTotals.fat;

  // Filter and score recipes
  const candidates = allRecipes
    .filter(r => r.meal_slot === mealSlot && r.id !== currentRecipeId)
    .map(r => {
      const cal = r.calories_per_serving || 0;
      const pro = r.protein_per_serving || 0;
      const carbs = r.carbs_per_serving || 0;
      const fat = r.fat_per_serving || 0;

      // Weighted distance from ideal (protein matters most)
      const score = Math.abs(cal - idealCal) / 100
        + Math.abs(pro - idealPro) * 2
        + Math.abs(carbs - idealCarbs)
        + Math.abs(fat - idealFat);

      return { recipe: r, score };
    })
    .sort((a, b) => a.score - b.score);

  return candidates.slice(0, 3).map(c => ({
    recipe_id: c.recipe.id,
    name: c.recipe.name,
    reason: `Best macro fit for your remaining ${mealSlot} targets`,
    macros: {
      calories: c.recipe.calories_per_serving || 0,
      protein: c.recipe.protein_per_serving || 0,
      carbs: c.recipe.carbs_per_serving || 0,
      fat: c.recipe.fat_per_serving || 0,
    },
  }));
}
