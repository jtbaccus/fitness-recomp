'use client';

import { useState, useEffect, useCallback } from 'react';
import PageShell from '@/components/PageShell';
import SessionHeader from '@/components/workout/SessionHeader';
import ExerciseCard from '@/components/workout/ExerciseCard';
import RestTimer from '@/components/workout/RestTimer';
import { getTodayDayType, getDayLabel, toLocalDateString, getDayOfWeekName } from '@/lib/utils';
import { getProgrammedDay } from '@/lib/program-config';
import type { WorkoutSession } from '@/types/database';
import Link from 'next/link';

export default function WorkoutPage() {
  const todayType = getTodayDayType();
  const today = toLocalDateString();
  const dayName = getDayOfWeekName(new Date().getDay());
  const programmedDay = getProgrammedDay(todayType);

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTimer, setShowTimer] = useState(false);

  // Check for existing session today
  useEffect(() => {
    fetch(`/api/workouts?date=${today}`)
      .then(r => r.json())
      .then((sessions: WorkoutSession[]) => {
        const existing = sessions.find(s => s.day_type === todayType && !s.completed);
        if (existing) setSession(existing);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [today, todayType]);

  const startSession = useCallback(async () => {
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: today,
        day_type: todayType,
        duration_min: null,
        notes: null,
        completed: false,
      }),
    });
    const newSession = await res.json();
    setSession(newSession);
  }, [today, todayType]);

  const completeSession = useCallback(async () => {
    if (!session) return;
    const elapsed = Math.floor((Date.now() - new Date(session.created_at).getTime()) / 60000);
    await fetch('/api/workouts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: session.id,
        completed: true,
        duration_min: elapsed,
      }),
    });
    setSession(prev => prev ? { ...prev, completed: true, duration_min: elapsed } : null);
  }, [session]);

  const handleSetConfirmed = useCallback(() => {
    setShowTimer(true);
  }, []);

  if (loading) {
    return (
      <PageShell title="Workout">
        <div className="bg-card rounded-xl h-32 animate-pulse" />
      </PageShell>
    );
  }

  // Rest day view
  if (todayType === 'abs_forearms') {
    return (
      <PageShell title={getDayLabel(todayType)} subtitle={`${dayName} — Light day at work`}>
        <div className="space-y-3">
          {!session ? (
            <button
              onClick={startSession}
              className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-default"
            >
              Start Session
            </button>
          ) : (
            <>
              <SessionHeader
                dayType={todayType}
                dayName={dayName}
                sessionActive={!session.completed}
                onComplete={completeSession}
              />
              {programmedDay.exercises.map(ex => (
                <ExerciseCard
                  key={ex.name}
                  exercise={ex}
                  sessionId={session.id}
                  onSetConfirmed={handleSetConfirmed}
                />
              ))}
              {showTimer && <RestTimer />}
            </>
          )}
          {session?.completed && (
            <div className="bg-success/10 rounded-xl p-4 text-center">
              <p className="text-success font-semibold">Session Complete!</p>
              <p className="text-sm text-text-secondary mt-1">{session.duration_min} minutes</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Link href="/program" className="text-sm text-accent hover:underline">
            View Program Reference
          </Link>
        </div>
      </PageShell>
    );
  }

  // Heavy / hypertrophy day
  return (
    <PageShell title={getDayLabel(todayType)} subtitle={`${dayName} — ${programmedDay.duration}`}>
      {!session ? (
        <button
          onClick={startSession}
          className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-default"
        >
          Start Workout
        </button>
      ) : (
        <>
          <SessionHeader
            dayType={todayType}
            dayName={dayName}
            sessionActive={!session.completed}
            onComplete={completeSession}
          />
          <div className="space-y-3">
            {programmedDay.exercises.map(ex => (
              <ExerciseCard
                key={ex.name}
                exercise={ex}
                sessionId={session.id}
                onSetConfirmed={handleSetConfirmed}
              />
            ))}
          </div>
          {showTimer && <RestTimer />}
          {session.completed && (
            <div className="mt-4 bg-success/10 rounded-xl p-4 text-center">
              <p className="text-success font-semibold">Workout Complete!</p>
              <p className="text-sm text-text-secondary mt-1">{session.duration_min} minutes</p>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
