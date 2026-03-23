'use client';

import PageShell from '@/components/PageShell';
import WeekSummaryCards from '@/components/coach/WeekSummaryCards';
import CoachAdvice from '@/components/coach/CoachAdvice';

export default function CoachPage() {
  return (
    <PageShell title="Coach" subtitle="AI-Powered Guidance">
      <div className="space-y-4">
        {/* Summary Cards */}
        <div>
          <h2 className="text-sm font-semibold text-text-muted mb-2">This Week at a Glance</h2>
          <WeekSummaryCards />
        </div>

        {/* AI Coach */}
        <CoachAdvice />
      </div>
    </PageShell>
  );
}
