'use client';

import { useState, useEffect } from 'react';
import type { ProgrammedExercise } from '@/types/program';
import type { ExerciseLog } from '@/types/database';
import SetRow from './SetRow';

interface ExerciseCardProps {
  exercise: ProgrammedExercise;
  sessionId: string;
  onSetConfirmed: () => void;
}

export default function ExerciseCard({ exercise, sessionId, onSetConfirmed }: ExerciseCardProps) {
  const [lastData, setLastData] = useState<ExerciseLog[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    fetch(`/api/exercises/last?exercise_name=${encodeURIComponent(exercise.name)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setLastData(data);
      })
      .catch(() => {});
  }, [exercise.name]);

  const handleConfirmSet = async (setNumber: number, weight: number, reps: number) => {
    const res = await fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        exercise_name: exercise.name,
        set_number: setNumber,
        weight_lbs: weight,
        reps,
      }),
    });
    return res.json();
  };

  const sets = Array.from({ length: exercise.sets }, (_, i) => i + 1);
  const lastBySet: Record<number, ExerciseLog> = {};
  lastData.forEach(l => { lastBySet[l.set_number] = l; });

  return (
    <div className="bg-card rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <h3 className="font-semibold text-white text-sm">{exercise.name}</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {exercise.sets} x {exercise.reps} &middot; {exercise.equipment}
            {exercise.notes && <span className="text-text-muted"> &middot; {exercise.notes}</span>}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-1.5">
          {sets.map(n => (
            <SetRow
              key={n}
              setNumber={n}
              targetReps={exercise.reps}
              lastWeight={lastBySet[n]?.weight_lbs}
              lastReps={lastBySet[n]?.reps}
              onConfirm={(w, r) => handleConfirmSet(n, w, r)}
              onSetConfirmed={onSetConfirmed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
