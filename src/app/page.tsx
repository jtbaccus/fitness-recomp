'use client';

import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import WeekPhaseCard from '@/components/dashboard/WeekPhaseCard';
import TodayWorkoutCard from '@/components/dashboard/TodayWorkoutCard';
import ComplianceRing from '@/components/dashboard/ComplianceRing';
import BodyweightSparkline from '@/components/dashboard/BodyweightSparkline';
import { formatDate } from '@/lib/utils';
import type { WorkoutDayType } from '@/types/program';

interface DashboardData {
  week: number;
  phase: string;
  label: string;
  todayType: WorkoutDayType;
  lastSession: { date: string; day_type: string; duration_min: number | null } | null;
  lastSessionExerciseCount: number;
  weeklySessionsCompleted: number;
  latestWeight: number | null;
  recentWeights: { date: string; weight: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <PageShell title="Dashboard">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Fitness Recomp" subtitle="12-week body recomposition">
      <div className="space-y-4">
        <WeekPhaseCard week={data.week} phase={data.phase} label={data.label} />
        <TodayWorkoutCard todayType={data.todayType} />

        <div className="grid grid-cols-2 gap-4">
          <ComplianceRing completed={data.weeklySessionsCompleted} total={7} />
          <BodyweightSparkline data={data.recentWeights} />
        </div>

        {data.lastSession && (
          <div className="bg-card rounded-xl p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Last Session</p>
            <p className="font-semibold text-sm">{formatDate(data.lastSession.date)}</p>
            <p className="text-xs text-text-secondary mt-0.5">
              {data.lastSession.day_type.replace(/_/g, ' ')} &middot; {data.lastSessionExerciseCount} sets logged
              {data.lastSession.duration_min && ` &middot; ${data.lastSession.duration_min} min`}
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
