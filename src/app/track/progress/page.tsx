'use client';

import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { Milestone, LiftingTarget } from '@/types/database';
import { formatDate } from '@/lib/utils';

function MilestoneItem({ milestone, onToggle }: { milestone: Milestone; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex items-start gap-3 w-full text-left py-2">
      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-default ${
        milestone.completed ? 'bg-success border-success' : 'border-border'
      }`}>
        {milestone.completed && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div>
        <p className={`text-sm ${milestone.completed ? 'text-text-muted line-through' : 'text-white'}`}>
          {milestone.description}
        </p>
        {milestone.target_date && (
          <p className="text-xs text-text-muted mt-0.5">{formatDate(milestone.target_date)}</p>
        )}
      </div>
    </button>
  );
}

function TargetBar({ target }: { target: LiftingTarget }) {
  const baseline = target.baseline_weight || 0;
  const current = target.current_max || baseline;
  const progress = baseline > 0 ? ((current - baseline) / baseline) * 100 : 0;

  return (
    <div className="py-2 border-b border-border last:border-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{target.exercise_name}</span>
        <span className="text-xs text-text-secondary">
          {current > 0 ? `${current} lbs` : 'No data'}
        </span>
      </div>
      {baseline > 0 && (
        <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function ProgressPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [targets, setTargets] = useState<LiftingTarget[]>([]);
  const [weights, setWeights] = useState<{ date: string; weight: number }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/milestones').then(r => r.json()),
      fetch('/api/targets').then(r => r.json()),
      fetch('/api/checkins').then(r => r.json()),
    ]).then(([m, t, c]) => {
      setMilestones(m);
      setTargets(t);
      setWeights(
        c.filter((ci: { weight_lbs: number | null }) => ci.weight_lbs)
          .map((ci: { date: string; weight_lbs: number }) => ({ date: ci.date, weight: ci.weight_lbs }))
          .reverse()
      );
    });
  }, []);

  const toggleMilestone = async (id: string, completed: boolean) => {
    await fetch('/api/milestones', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : null,
      }),
    });
    setMilestones(prev =>
      prev.map(m => m.id === id ? { ...m, completed: !completed, completed_at: !completed ? new Date().toISOString() : null } : m)
    );
  };

  return (
    <PageShell title="Progress" subtitle="Track your 12-week journey">
      <div className="space-y-4">
        {weights.length > 1 && (
          <div className="bg-card rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">Bodyweight Trend</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weights}>
                  <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#666', fontSize: 10 }} width={35} />
                  <Tooltip
                    contentStyle={{ background: '#262626', border: 'none', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`${v} lbs`, 'Weight']}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Milestones</h3>
          <div className="divide-y divide-border">
            {milestones.map(m => (
              <MilestoneItem
                key={m.id}
                milestone={m}
                onToggle={() => toggleMilestone(m.id, m.completed)}
              />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Lifting Targets</h3>
          {targets.map(t => (
            <TargetBar key={t.id} target={t} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
