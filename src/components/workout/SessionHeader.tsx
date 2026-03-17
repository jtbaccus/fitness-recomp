'use client';

import { useState, useEffect } from 'react';
import { getDayLabel } from '@/lib/utils';
import type { WorkoutDayType } from '@/types/program';

interface SessionHeaderProps {
  dayType: WorkoutDayType;
  dayName: string;
  sessionActive: boolean;
  onComplete: () => void;
}

export default function SessionHeader({ dayType, dayName, sessionActive, onComplete }: SessionHeaderProps) {
  const [elapsed, setElapsed] = useState(0);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    if (!sessionActive) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionActive, startTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="bg-card rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{getDayLabel(dayType)}</h2>
          <p className="text-sm text-text-secondary">{dayName}</p>
        </div>
        <div className="text-right">
          {sessionActive && (
            <p className="text-lg font-mono text-accent">
              {mins}:{secs.toString().padStart(2, '0')}
            </p>
          )}
        </div>
      </div>
      {sessionActive && (
        <button
          onClick={onComplete}
          className="mt-3 w-full py-2.5 bg-success/20 text-success font-semibold rounded-lg hover:bg-success/30 transition-default"
        >
          Complete Session
        </button>
      )}
    </div>
  );
}
