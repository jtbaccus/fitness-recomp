import { streamText } from 'ai';
import { getAIModel, isAIConfigured } from '@/lib/ai-config';
import { COACH_PROMPT } from '@/lib/ai-prompts';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import { getCurrentWeek, getCurrentPhase } from '@/lib/utils';
import { MACRO_TARGETS } from '@/lib/program-config';
import type { CheckIn, NutritionLog } from '@/types/database';

export const dynamic = 'force-dynamic';

async function getRecentCheckIns(): Promise<CheckIn[]> {
  const { isConfigured } = getSupabaseConfig();
  if (!isConfigured) {
    return localStore.getCheckIns().slice(0, 4);
  }
  return supabaseFetch<CheckIn[]>('check_ins?order=date.desc&limit=4');
}

async function getRecentNutritionLogs(): Promise<NutritionLog[]> {
  const { isConfigured } = getSupabaseConfig();
  if (!isConfigured) {
    return localStore.getNutritionLogs().slice(0, 7);
  }
  return supabaseFetch<NutritionLog[]>('nutrition_logs?order=date.desc&limit=7');
}

function buildUserMessage(checkIns: CheckIn[], nutritionLogs: NutritionLog[]): string {
  const week = getCurrentWeek();
  const { label: phase } = getCurrentPhase(week);
  const proteinTarget = MACRO_TARGETS.training.protein;

  const lines: string[] = [
    `Current week: ${week} | Phase: ${phase}`,
    `Protein target: ${proteinTarget}g/day`,
    '',
  ];

  if (checkIns.length > 0) {
    lines.push('Recent check-ins (newest first):');
    for (const ci of checkIns) {
      const parts = [`  ${ci.date}:`];
      if (ci.weight_lbs != null) parts.push(`weight=${ci.weight_lbs}lbs`);
      if (ci.waist_inches != null) parts.push(`waist=${ci.waist_inches}in`);
      if (ci.compliance_score != null) parts.push(`compliance=${ci.compliance_score}/10`);
      if (ci.sleep_score != null) parts.push(`sleep=${ci.sleep_score}/10`);
      if (ci.energy_score != null) parts.push(`energy=${ci.energy_score}/10`);
      if (ci.notes) parts.push(`notes="${ci.notes}"`);
      lines.push(parts.join(' '));
    }
    lines.push('');
  } else {
    lines.push('No check-in data yet.');
    lines.push('');
  }

  if (nutritionLogs.length > 0) {
    lines.push('Last 7 days nutrition:');
    for (const nl of nutritionLogs) {
      lines.push(
        `  ${nl.date}: ${nl.calories}cal, ${nl.protein_g}g protein, ${nl.carbs_g}g carbs, ${nl.fat_g}g fat`
      );
    }
    lines.push('');
  } else {
    lines.push('No nutrition data yet.');
    lines.push('');
  }

  lines.push('Give me my weekly coaching advice.');
  return lines.join('\n');
}

function generateFallbackAdvice(checkIns: CheckIn[], nutritionLogs: NutritionLog[]): string {
  const suggestions: string[] = [];
  const proteinTarget = MACRO_TARGETS.training.protein;

  // Check avg protein
  if (nutritionLogs.length > 0) {
    const avgProtein = Math.round(
      nutritionLogs.reduce((sum, nl) => sum + nl.protein_g, 0) / nutritionLogs.length
    );
    if (avgProtein < proteinTarget) {
      suggestions.push(
        `Your protein averaged ${avgProtein}g/day over the last ${nutritionLogs.length} days, ` +
        `which is ${proteinTarget - avgProtein}g below your ${proteinTarget}g target. ` +
        `Add a protein shake or extra serving of chicken/fish to close the gap.`
      );
    } else {
      suggestions.push(
        `Great protein intake - averaging ${avgProtein}g/day against your ${proteinTarget}g target. Keep it up.`
      );
    }
  }

  // Check compliance trend
  const complianceScores = checkIns
    .filter(ci => ci.compliance_score != null)
    .map(ci => ci.compliance_score!);
  if (complianceScores.length >= 2) {
    const recent = complianceScores[0];
    const previous = complianceScores[complianceScores.length - 1];
    if (recent < previous) {
      suggestions.push(
        `Compliance dropped from ${previous}/10 to ${recent}/10. ` +
        `Identify the biggest friction point (meal prep? schedule?) and simplify it.`
      );
    } else if (recent >= 8) {
      suggestions.push(
        `Compliance is solid at ${recent}/10. Stay consistent with what's working.`
      );
    }
  }

  // Check weight trend
  const weights = checkIns
    .filter(ci => ci.weight_lbs != null)
    .map(ci => ci.weight_lbs!);
  if (weights.length >= 2) {
    const diff = weights[0] - weights[weights.length - 1];
    if (diff > 1) {
      suggestions.push(
        `Weight is up ${diff.toFixed(1)} lbs over your last ${weights.length} check-ins. ` +
        `If recomposition is the goal, tighten up calorie tracking on rest days.`
      );
    } else if (diff < -1) {
      suggestions.push(
        `Weight is down ${Math.abs(diff).toFixed(1)} lbs. Make sure you're eating enough on training days ` +
        `to support recovery and muscle growth.`
      );
    } else {
      suggestions.push(
        `Weight is stable (${weights[0]} lbs). During recomposition that's expected - ` +
        `focus on strength progression and waist measurements.`
      );
    }
  }

  if (suggestions.length === 0) {
    suggestions.push(
      'Not enough data yet for specific advice. Log a few check-ins and nutrition days, then come back for personalized coaching.'
    );
  }

  return suggestions.join('\n\n');
}

export async function POST() {
  try {
    const [checkIns, nutritionLogs] = await Promise.all([
      getRecentCheckIns(),
      getRecentNutritionLogs(),
    ]);

    if (!isAIConfigured()) {
      const advice = generateFallbackAdvice(checkIns, nutritionLogs);
      return new Response(advice);
    }

    const model = getAIModel();
    if (!model) {
      const advice = generateFallbackAdvice(checkIns, nutritionLogs);
      return new Response(advice);
    }

    const userMessage = buildUserMessage(checkIns, nutritionLogs);

    const result = streamText({
      model,
      system: COACH_PROMPT,
      prompt: userMessage,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    return new Response(`Error generating advice: ${String(err)}`, { status: 500 });
  }
}
