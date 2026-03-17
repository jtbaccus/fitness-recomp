'use client';

import { useState, useEffect, useCallback } from 'react';

const PRESETS = [60, 90, 120, 180];

export default function RestTimer() {
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(0);
  const [active, setActive] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const start = useCallback((secs: number) => {
    setDuration(secs);
    setRemaining(secs);
    setActive(true);
    setCollapsed(false);
  }, []);

  useEffect(() => {
    if (!active || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setActive(false);
          // Vibrate on completion
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [active, remaining]);

  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg"
      >
        <span className="text-xs font-bold">{mins}:{secs.toString().padStart(2, '0')}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 bg-elevated border border-border rounded-xl p-3 shadow-xl max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-text-secondary">Rest Timer</span>
        <button onClick={() => setCollapsed(true)} className="text-text-muted text-xs">
          Minimize
        </button>
      </div>

      {active ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-mono font-bold text-white">
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
            <button
              onClick={() => { setActive(false); setRemaining(0); }}
              className="text-sm text-warning px-3 py-1 rounded-lg bg-warning/10"
            >
              Stop
            </button>
          </div>
          <div className="h-1.5 bg-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div>
          {remaining === 0 && !active && duration > 0 && (
            <p className="text-success text-sm font-medium mb-2">Rest complete!</p>
          )}
          <div className="flex gap-2">
            {PRESETS.map(s => (
              <button
                key={s}
                onClick={() => start(s)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-default ${
                  s === duration && !active
                    ? 'bg-accent text-white'
                    : 'bg-bg text-text-secondary hover:bg-card'
                }`}
              >
                {s >= 60 ? `${s / 60}m` : `${s}s`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
