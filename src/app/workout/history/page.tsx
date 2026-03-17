'use client';

import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import { formatDate, getDayLabel } from '@/lib/utils';
import type { WorkoutSession, ExerciseLog } from '@/types/database';
import type { WorkoutDayType } from '@/types/program';

export default function WorkoutHistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);

  useEffect(() => {
    fetch('/api/workouts')
      .then(r => r.json())
      .then(setSessions)
      .catch(() => {});
  }, []);

  const loadSession = async (session: WorkoutSession) => {
    setSelectedSession(session);
    const res = await fetch(`/api/exercises?session_id=${session.id}`);
    const data = await res.json();
    setExercises(data);
  };

  if (selectedSession) {
    const grouped: Record<string, ExerciseLog[]> = {};
    exercises.forEach(ex => {
      if (!grouped[ex.exercise_name]) grouped[ex.exercise_name] = [];
      grouped[ex.exercise_name].push(ex);
    });

    return (
      <PageShell title="Session Detail" subtitle={formatDate(selectedSession.date)}>
        <button onClick={() => setSelectedSession(null)} className="text-sm text-accent mb-4">
          &larr; Back to history
        </button>
        <div className="bg-card rounded-xl p-4 mb-4">
          <p className="font-semibold">{getDayLabel(selectedSession.day_type as WorkoutDayType)}</p>
          <p className="text-xs text-text-secondary mt-0.5">
            {selectedSession.duration_min ? `${selectedSession.duration_min} min` : 'Duration not recorded'}
            {selectedSession.completed ? ' · Completed' : ' · In progress'}
          </p>
        </div>
        <div className="space-y-3">
          {Object.entries(grouped).map(([name, logs]) => (
            <div key={name} className="bg-card rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-2">{name}</h3>
              <div className="space-y-1">
                {logs.sort((a, b) => a.set_number - b.set_number).map(log => (
                  <div key={log.id} className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted w-8">S{log.set_number}</span>
                    <span>{log.weight_lbs} lbs x {log.reps}</span>
                    {log.is_pr && (
                      <span className="text-xs text-success font-bold">PR</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Workout History">
      <div className="space-y-2">
        {sessions.length === 0 && (
          <p className="text-sm text-text-secondary">No workouts logged yet.</p>
        )}
        {sessions.map(s => {
          const dayColors: Record<string, string> = {
            heavy_upper: 'bg-accent/20 text-accent',
            heavy_lower: 'bg-success/20 text-success',
            upper_hypertrophy: 'bg-purple-500/20 text-purple-400',
            lower_hypertrophy: 'bg-amber/20 text-amber',
            abs_forearms: 'bg-elevated text-text-secondary',
          };
          return (
            <button
              key={s.id}
              onClick={() => loadSession(s)}
              className="w-full bg-card rounded-xl p-4 text-left hover:bg-elevated transition-default"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{formatDate(s.date)}</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-lg ${dayColors[s.day_type] || 'bg-elevated text-text-secondary'}`}>
                    {getDayLabel(s.day_type as WorkoutDayType)}
                  </span>
                </div>
                <div className="text-right text-xs text-text-secondary">
                  {s.duration_min && <p>{s.duration_min} min</p>}
                  {s.completed && <p className="text-success">Complete</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </PageShell>
  );
}
