'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDayLabel } from '@/lib/utils';
import { getProgrammedDay } from '@/lib/program-config';
import type { WorkoutDayType } from '@/types/program';
import type { LiftingTarget } from '@/types/database';

interface DayWorkoutCardProps {
  dayType: WorkoutDayType | 'rest';
  completed?: boolean;
}

const typeColors: Record<string, string> = {
  heavy_upper: 'bg-warning/20 text-warning',
  heavy_lower: 'bg-warning/20 text-warning',
  upper_hypertrophy: 'bg-accent/20 text-accent',
  lower_hypertrophy: 'bg-accent/20 text-accent',
  abs_forearms: 'bg-amber/20 text-amber',
};

export default function DayWorkoutCard({ dayType, completed }: DayWorkoutCardProps) {
  const label = getDayLabel(dayType);
  const [targets, setTargets] = useState<LiftingTarget[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (dayType === 'rest') return;
    fetch('/api/targets')
      .then(r => r.json())
      .then(setTargets)
      .catch(console.error);
  }, [dayType]);

  if (dayType === 'rest') {
    return (
      <div className="bg-card rounded-xl p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Workout</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium bg-elevated text-text-secondary">
            {label}
          </span>
        </div>
        <p className="text-xs text-text-muted mt-2">Rest day — recover and stretch</p>
      </div>
    );
  }

  const program = getProgrammedDay(dayType);

  const getTarget = (exerciseName: string) =>
    targets.find(t => t.exercise_name === exerciseName);

  const saveTarget = async (exerciseName: string, weight: number) => {
    const target = getTarget(exerciseName);
    if (!target) return;

    const field = target.baseline_weight ? 'current_max' : 'baseline_weight';
    const res = await fetch('/api/targets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: target.id, [field]: weight }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTargets(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, exerciseName: string) => {
    if (e.key === 'Enter') {
      const val = parseFloat(editValue);
      if (!isNaN(val) && val > 0) saveTarget(exerciseName, val);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Workout</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${typeColors[dayType] || ''}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-text-muted">{program.duration}</span>
          {completed ? (
            <span className="text-xs text-success font-medium">Done</span>
          ) : (
            <Link href="/workout" className="text-xs text-accent font-medium">Start</Link>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {program.exercises.map((ex, i) => {
          const target = getTarget(ex.name);
          const displayWeight = target?.current_max || target?.baseline_weight;
          const isEditing = editingId === ex.name;

          return (
            <div key={i} className="flex items-center justify-between py-1 border-b border-elevated/50 last:border-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white">{ex.name}</span>
                  {ex.notes && (
                    <span className="text-[10px] text-text-muted truncate">({ex.notes})</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-text-secondary">{ex.sets}x{ex.reps}</span>
                  <span className="text-[10px] text-text-muted">{ex.equipment}</span>
                </div>
              </div>

              {target && (
                <div className="ml-2 flex-shrink-0">
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-16 bg-elevated text-white text-xs text-center rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-accent"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, ex.name)}
                      onBlur={() => {
                        const val = parseFloat(editValue);
                        if (!isNaN(val) && val > 0) saveTarget(ex.name, val);
                        else setEditingId(null);
                      }}
                      autoFocus
                      placeholder="lbs"
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(ex.name);
                        setEditValue(displayWeight ? String(displayWeight) : '');
                      }}
                      className={`text-xs px-2 py-0.5 rounded ${
                        displayWeight
                          ? 'bg-elevated text-white'
                          : 'bg-elevated/50 text-text-muted border border-dashed border-text-muted/30'
                      }`}
                    >
                      {displayWeight ? `${displayWeight} lb` : 'Set wt'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
