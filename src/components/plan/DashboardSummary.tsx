'use client';

import { useState, useEffect } from 'react';
import WeekPhaseCard from '@/components/dashboard/WeekPhaseCard';
import ComplianceRing from '@/components/dashboard/ComplianceRing';

interface DashboardData {
  week: number;
  phase: string;
  label: string;
  weeklySessionsCompleted: number;
}

export default function DashboardSummary() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <div className="bg-card rounded-xl h-20 animate-pulse" />;
  }

  return (
    <div className="space-y-3">
      <WeekPhaseCard week={data.week} phase={data.phase} label={data.label} />
      <ComplianceRing completed={data.weeklySessionsCompleted} total={7} />
    </div>
  );
}
