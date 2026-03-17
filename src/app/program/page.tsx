'use client';

import PageShell from '@/components/PageShell';
import { WEEKLY_PROGRAM, MACRO_TARGETS, PHASES } from '@/lib/program-config';
import type { NutritionDayType } from '@/types/program';

export default function ProgramPage() {
  return (
    <PageShell title="Program Reference" subtitle="12-week body recomposition plan">
      <div className="space-y-4">
        {/* Phase Timeline */}
        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Phases</h3>
          <div className="space-y-3">
            {PHASES.map(p => (
              <div key={p.phase} className="flex items-start gap-3">
                <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                  p.phase === 'foundation' ? 'bg-accent' :
                  p.phase === 'progression' ? 'bg-amber' : 'bg-warning'
                }`} />
                <div>
                  <p className="text-sm font-medium">{p.label} (Weeks {p.weekStart}–{p.weekEnd})</p>
                  <p className="text-xs text-text-secondary">{p.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Targets */}
        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Macro Targets</h3>
          <div className="space-y-3">
            {(['training', 'work', 'rest'] as NutritionDayType[]).map(dt => {
              const t = MACRO_TARGETS[dt];
              return (
                <div key={dt} className="border-b border-border last:border-0 pb-2 last:pb-0">
                  <p className="text-sm font-medium capitalize mb-1">{dt} Day</p>
                  <div className="grid grid-cols-4 gap-2 text-xs text-text-secondary">
                    <span>{t.calories[0]}–{t.calories[1]} cal</span>
                    <span>{t.protein}g pro</span>
                    <span>{t.carbs[0]}–{t.carbs[1]}g carb</span>
                    <span>{t.fat[0]}–{t.fat[1]}g fat</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Split */}
        {WEEKLY_PROGRAM.map(day => (
          <div key={day.dayType} className="bg-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{day.label}</h3>
              <span className="text-xs text-text-muted">{day.duration}</span>
            </div>
            <div className="space-y-2">
              {day.exercises.map((ex, i) => (
                <div key={i} className="flex items-start gap-2 py-1">
                  <span className="text-xs text-text-muted w-5 shrink-0">{i + 1}.</span>
                  <div>
                    <p className="text-sm">{ex.name}</p>
                    <p className="text-xs text-text-secondary">
                      {ex.sets} x {ex.reps} &middot; {ex.equipment}
                      {ex.notes && <span className="text-text-muted"> &middot; {ex.notes}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
