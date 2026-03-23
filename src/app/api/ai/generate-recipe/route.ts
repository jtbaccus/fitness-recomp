import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getAIModel, isAIConfigured } from '@/lib/ai-config';
import { FRIDGE_RECIPE_PROMPT, getMacroContext } from '@/lib/ai-prompts';
import type { MealSlot } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { ingredients, meal_slot, day_type } = await request.json() as {
      ingredients: string[];
      meal_slot: MealSlot;
      day_type: 'training' | 'work';
    };

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'At least one ingredient is required' },
        { status: 400 }
      );
    }

    if (!meal_slot) {
      return NextResponse.json(
        { error: 'meal_slot is required' },
        { status: 400 }
      );
    }

    if (!isAIConfigured()) {
      return NextResponse.json(
        { error: 'AI not configured' },
        { status: 501 }
      );
    }

    const model = getAIModel();
    if (!model) {
      return NextResponse.json(
        { error: 'AI not configured' },
        { status: 501 }
      );
    }

    const macroContext = getMacroContext(day_type || 'training');

    const userMessage = `Available ingredients: ${ingredients.join(', ')}

Meal slot: ${meal_slot}

${macroContext}

Create a recipe using these ingredients that fits the ${meal_slot} slot and hits the macro targets as closely as possible. Use only the listed ingredients plus basic pantry staples (salt, pepper, oil, garlic).`;

    const result = await generateText({
      model,
      system: FRIDGE_RECIPE_PROMPT,
      prompt: userMessage,
    });

    // Parse the JSON response from the AI
    try {
      const parsed = JSON.parse(result.text);
      // Ensure meal_slot matches what was requested
      parsed.meal_slot = meal_slot;
      return NextResponse.json(parsed);
    } catch {
      // Try to extract JSON from the response if it has extra text around it
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          parsed.meal_slot = meal_slot;
          return NextResponse.json(parsed);
        } catch {
          // Give up
        }
      }
      console.error('Failed to parse AI response:', result.text);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error('AI generate recipe error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
