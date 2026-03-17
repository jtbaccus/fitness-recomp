'use client';

import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import { toLocalDateString, getNutritionDayTypeForDate, formatDate } from '@/lib/utils';
import { MACRO_TARGETS } from '@/lib/program-config';
import type { NutritionLog } from '@/types/database';
import type { NutritionDayType } from '@/types/program';

function MacroBar({ label, value, min, max, unit }: { label: string; value: number; min: number; max: number; unit: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 120) : 0;
  const inRange = value >= min && value <= max;
  const over = value > max;
  const color = inRange ? 'bg-success' : over ? 'bg-warning' : 'bg-amber';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className={inRange ? 'text-success' : over ? 'text-warning' : 'text-amber'}>
          {value}{unit} <span className="text-text-muted">/ {min}–{max}</span>
        </span>
      </div>
      <div className="h-2 bg-elevated rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

export default function NutritionPage() {
  const [date, setDate] = useState(toLocalDateString());
  const [log, setLog] = useState<NutritionLog | null>(null);
  const [saving, setSaving] = useState(false);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');

  const dayType: NutritionDayType = getNutritionDayTypeForDate(new Date(date + 'T00:00:00'));
  const targets = MACRO_TARGETS[dayType];
  const dayLabel = dayType === 'training' ? 'Training Day' : dayType === 'work' ? 'Work Day' : 'Rest Day';

  useEffect(() => {
    fetch(`/api/nutrition?date=${date}`)
      .then(r => r.json())
      .then((data: NutritionLog[]) => {
        if (data.length > 0) {
          const entry = data[0];
          setLog(entry);
          setCalories(entry.calories.toString());
          setProtein(entry.protein_g.toString());
          setCarbs(entry.carbs_g.toString());
          setFat(entry.fat_g.toString());
          setNotes(entry.notes || '');
        } else {
          setLog(null);
          setCalories('');
          setProtein('');
          setCarbs('');
          setFat('');
          setNotes('');
        }
      });
  }, [date]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          day_type: dayType,
          calories: parseInt(calories) || 0,
          protein_g: parseInt(protein) || 0,
          carbs_g: parseInt(carbs) || 0,
          fat_g: parseInt(fat) || 0,
          notes: notes || null,
        }),
      });
      const saved = await res.json();
      setLog(saved);
    } finally {
      setSaving(false);
    }
  };

  const cal = parseInt(calories) || 0;
  const pro = parseInt(protein) || 0;
  const carb = parseInt(carbs) || 0;
  const f = parseInt(fat) || 0;

  return (
    <PageShell title="Nutrition" subtitle={`${formatDate(date)} — ${dayLabel}`}>
      <div className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
        />

        <div className="bg-card rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Targets</h3>
            <span className={`text-xs px-2 py-0.5 rounded-lg ${
              dayType === 'training' ? 'bg-accent/20 text-accent' : dayType === 'work' ? 'bg-amber/20 text-amber' : 'bg-elevated text-text-secondary'
            }`}>
              {dayLabel}
            </span>
          </div>
          <MacroBar label="Calories" value={cal} min={targets.calories[0]} max={targets.calories[1]} unit=" kcal" />
          <MacroBar label="Protein" value={pro} min={targets.protein} max={targets.protein + 20} unit="g" />
          <MacroBar label="Carbs" value={carb} min={targets.carbs[0]} max={targets.carbs[1]} unit="g" />
          <MacroBar label="Fat" value={f} min={targets.fat[0]} max={targets.fat[1]} unit="g" />
        </div>

        <div className="bg-card rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm">Log Entry</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">Calories</label>
              <input type="number" inputMode="numeric" value={calories} onChange={e => setCalories(e.target.value)}
                className="w-full mt-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none" placeholder="2600" />
            </div>
            <div>
              <label className="text-xs text-text-muted">Protein (g)</label>
              <input type="number" inputMode="numeric" value={protein} onChange={e => setProtein(e.target.value)}
                className="w-full mt-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none" placeholder="200" />
            </div>
            <div>
              <label className="text-xs text-text-muted">Carbs (g)</label>
              <input type="number" inputMode="numeric" value={carbs} onChange={e => setCarbs(e.target.value)}
                className="w-full mt-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none" placeholder="300" />
            </div>
            <div>
              <label className="text-xs text-text-muted">Fat (g)</label>
              <input type="number" inputMode="numeric" value={fat} onChange={e => setFat(e.target.value)}
                className="w-full mt-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none" placeholder="70" />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full mt-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none resize-none h-16"
              placeholder="How was eating today?" />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="w-full py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-default disabled:opacity-50">
            {saving ? 'Saving...' : log ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
