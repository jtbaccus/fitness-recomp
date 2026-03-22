'use client';

import Link from 'next/link';
import { getDayLabel } from '@/lib/utils';
import { getProgrammedDay } from '@/lib/program-config';
import type { WorkoutDayType } from '@/types/program';

interface DayWorkoutCardProps {
  dayType: WorkoutDayType;
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
  const program = getProgrammedDay(dayType);
  const label = getDayLabel(dayType);

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Workout</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${typeColors[dayType] || ''}`}>
            {label}
          </span>
        </div>
        {completed ? (
          <span className="text-xs text-success font-medium">Done</span>
        ) : (
          <Link href="/workout" className="text-xs text-accent font-medium">Start</Link>
        )}
      </div>
      <div className="space-y-1">
        {program.exercises.slice(0, 4).map(ex => (
          <p key={ex.name} className="text-xs text-text-secondary">
            {ex.name} — {ex.sets}x{ex.reps}
          </p>
        ))}
        {program.exercises.length > 4 && (
          <p className="text-xs text-text-muted">+{program.exercises.length - 4} more</p>
        )}
      </div>
      <p className="text-[10px] text-text-muted mt-2">{program.duration}</p>
    </div>
  );
}
