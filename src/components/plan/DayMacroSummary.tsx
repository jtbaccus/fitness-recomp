'use client';

import MacroBar from '@/components/shared/MacroBar';
import { MACRO_TARGETS } from '@/lib/program-config';
import type { NutritionDayType } from '@/types/program';

interface DayMacroSummaryProps {
  dayType: NutritionDayType;
  totals: { calories: number; protein: number; carbs: number; fat: number };
}

export default function DayMacroSummary({ dayType, totals }: DayMacroSummaryProps) {
  const targets = MACRO_TARGETS[dayType];
  const dayLabel = dayType === 'training' ? 'Training Day' : dayType === 'work' ? 'Work Day' : 'Rest Day';

  return (
    <div className="bg-card rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Planned Macros</h3>
        <span className={`text-xs px-2 py-0.5 rounded-lg ${
          dayType === 'training' ? 'bg-accent/20 text-accent' : dayType === 'work' ? 'bg-amber/20 text-amber' : 'bg-elevated text-text-secondary'
        }`}>
          {dayLabel}
        </span>
      </div>
      <MacroBar label="Calories" value={totals.calories} min={targets.calories[0]} max={targets.calories[1]} unit=" kcal" />
      <MacroBar label="Protein" value={totals.protein} min={targets.protein} max={targets.protein + 20} unit="g" />
      <MacroBar label="Carbs" value={totals.carbs} min={targets.carbs[0]} max={targets.carbs[1]} unit="g" />
      <MacroBar label="Fat" value={totals.fat} min={targets.fat[0]} max={targets.fat[1]} unit="g" />
    </div>
  );
}
