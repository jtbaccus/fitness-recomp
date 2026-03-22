'use client';

import Link from 'next/link';
import type { DaySummary } from '@/app/api/plan/summary/route';

interface WeekStripProps {
  days: DaySummary[];
  today: string;
}

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const workoutColors: Record<string, string> = {
  heavy_upper: 'bg-warning',
  heavy_lower: 'bg-warning',
  upper_hypertrophy: 'bg-accent',
  lower_hypertrophy: 'bg-accent',
  abs_forearms: 'bg-amber',
};

export default function WeekStrip({ days, today }: WeekStripProps) {
  return (
    <div className="bg-card rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">This Week</h3>
        <div className="flex gap-2">
          <Link href="/plan/grocery" className="text-xs text-accent font-medium">Grocery List</Link>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isToday = day.date === today;
          const dow = new Date(day.date + 'T00:00:00').getDay();
          const mealCount = day.meals.length;

          return (
            <Link
              key={day.date}
              href={`/plan/day/${day.date}`}
              className={`flex flex-col items-center py-2 rounded-lg transition-default ${
                isToday ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-elevated'
              }`}
            >
              <span className="text-[10px] text-text-muted">{DOW[dow]}</span>
              <span className={`text-xs font-semibold mt-0.5 ${isToday ? 'text-accent' : 'text-white'}`}>
                {new Date(day.date + 'T00:00:00').getDate()}
              </span>
              <div className={`w-2 h-2 rounded-full mt-1 ${workoutColors[day.workout_type] || 'bg-elevated'}`} />
              <div className="flex gap-0.5 mt-0.5">
                {[0, 1, 2, 3].map(j => (
                  <div
                    key={j}
                    className={`w-1 h-1 rounded-full ${j < mealCount ? 'bg-success' : 'bg-elevated'}`}
                  />
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
