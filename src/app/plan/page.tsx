'use client';

import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import DashboardSummary from '@/components/plan/DashboardSummary';
import MonthCalendar from '@/components/plan/MonthCalendar';
import WeekStrip from '@/components/plan/WeekStrip';
import { toLocalDateString } from '@/lib/utils';
import { generateMealSchedulePDF } from '@/lib/meal-schedule-pdf';
import type { DaySummary } from '@/app/api/plan/summary/route';

export default function PlanPage() {
  const today = toLocalDateString();
  const todayDate = new Date(today + 'T00:00:00');
  const [calYear, setCalYear] = useState(todayDate.getFullYear());
  const [calMonth, setCalMonth] = useState(todayDate.getMonth());
  const [monthData, setMonthData] = useState<DaySummary[]>([]);
  const [weekData, setWeekData] = useState<DaySummary[]>([]);

  // Fetch month data
  useEffect(() => {
    const start = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(calYear, calMonth + 1, 0).getDate();
    const end = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    fetch(`/api/plan/summary?start=${start}&end=${end}`)
      .then(r => r.json())
      .then(setMonthData)
      .catch(console.error);
  }, [calYear, calMonth]);

  // Fetch this week's data (Sun–Sat of current week)
  useEffect(() => {
    const now = new Date();
    const sun = new Date(now);
    sun.setDate(now.getDate() - now.getDay());
    const sat = new Date(sun);
    sat.setDate(sun.getDate() + 6);

    const startStr = toLocalDateString(sun);
    const endStr = toLocalDateString(sat);

    fetch(`/api/plan/summary?start=${startStr}&end=${endStr}`)
      .then(r => r.json())
      .then(setWeekData)
      .catch(console.error);
  }, []);

  return (
    <PageShell title="Plan" subtitle="Calendar & Meal Planning">
      <div className="space-y-4">
        <DashboardSummary />

        <MonthCalendar
          year={calYear}
          month={calMonth}
          days={monthData}
          today={today}
          onMonthChange={(y, m) => { setCalYear(y); setCalMonth(m); }}
        />

        {weekData.length > 0 && (
          <>
            <WeekStrip days={weekData} today={today} />
            <button
              onClick={() => {
                const sun = new Date();
                sun.setDate(sun.getDate() - sun.getDay());
                generateMealSchedulePDF(weekData, toLocalDateString(sun));
              }}
              className="w-full py-2 bg-elevated text-white text-sm font-medium rounded-xl"
            >
              Export Week PDF
            </button>
          </>
        )}
      </div>
    </PageShell>
  );
}
