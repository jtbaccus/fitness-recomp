'use client';

import Link from 'next/link';
import { getDayLabel } from '@/lib/utils';
import { getProgrammedDay } from '@/lib/program-config';
import type { WorkoutDayType } from '@/types/program';

interface TodayWorkoutCardProps {
  todayType: WorkoutDayType;
}

export default function TodayWorkoutCard({ todayType }: TodayWorkoutCardProps) {
  const day = getProgrammedDay(todayType);

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider">Today</p>
          <h3 className="text-base font-bold mt-0.5">{getDayLabel(todayType)}</h3>
        </div>
        <span className="text-xs text-text-secondary bg-elevated px-2 py-1 rounded-lg">
          {day.duration}
        </span>
      </div>
      <p className="text-sm text-text-secondary mb-3">
        {day.exercises.length} exercises
      </p>
      <Link
        href="/workout"
        className="block w-full py-2.5 text-center bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-default"
      >
        Start Workout
      </Link>
    </div>
  );
}
