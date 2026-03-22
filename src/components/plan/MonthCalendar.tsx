'use client';

import Link from 'next/link';
import type { DaySummary } from '@/app/api/plan/summary/route';

interface MonthCalendarProps {
  year: number;
  month: number; // 0-indexed
  days: DaySummary[];
  today: string;
  onMonthChange: (year: number, month: number) => void;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const workoutDotColors: Record<string, string> = {
  heavy_upper: 'bg-warning',
  heavy_lower: 'bg-warning',
  upper_hypertrophy: 'bg-accent',
  lower_hypertrophy: 'bg-accent',
  abs_forearms: 'bg-amber',
};

export default function MonthCalendar({ year, month, days, today, onMonthChange }: MonthCalendarProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayMap = new Map(days.map(d => [d.date, d]));

  const prevMonth = () => {
    if (month === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, month - 1);
  };

  const nextMonth = () => {
    if (month === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, month + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-text-muted p-1 hover:text-white transition-default">
          <ChevronLeft />
        </button>
        <h3 className="font-semibold text-sm">{MONTH_NAMES[month]} {year}</h3>
        <button onClick={nextMonth} className="text-text-muted p-1 hover:text-white transition-default">
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[10px] text-text-muted py-1">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-10" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const summary = dayMap.get(dateStr);
          const isToday = dateStr === today;
          const hasMeals = summary && summary.meals.length > 0;
          const workoutColor = summary ? workoutDotColors[summary.workout_type] : undefined;

          return (
            <Link
              key={dateStr}
              href={`/plan/day/${dateStr}`}
              className={`h-10 flex flex-col items-center justify-center rounded-lg transition-default ${
                isToday ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-elevated'
              }`}
            >
              <span className={`text-xs ${isToday ? 'font-bold text-accent' : 'text-text-secondary'}`}>
                {day}
              </span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {workoutColor && <div className={`w-1.5 h-1.5 rounded-full ${workoutColor}`} />}
                {hasMeals && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-[10px] text-text-muted">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning inline-block" /> Heavy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent inline-block" /> Hypertrophy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber inline-block" /> Abs</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block" /> Meals</span>
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
