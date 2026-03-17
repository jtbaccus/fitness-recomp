'use client';

import { useState } from 'react';
import PRBadge from './PRBadge';

interface SetRowProps {
  setNumber: number;
  targetReps: string;
  lastWeight?: number;
  lastReps?: number;
  onConfirm: (weight: number, reps: number, rpe?: number) => Promise<{ is_pr: boolean }>;
  onSetConfirmed: () => void;
}

export default function SetRow({ setNumber, targetReps, lastWeight, lastReps, onConfirm, onSetConfirmed }: SetRowProps) {
  const [weight, setWeight] = useState(lastWeight?.toString() || '');
  const [reps, setReps] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isPR, setIsPR] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (isNaN(w) || isNaN(r) || r <= 0) return;

    setSaving(true);
    try {
      const result = await onConfirm(w, r);
      setConfirmed(true);
      setIsPR(result.is_pr);
      onSetConfirmed();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 py-2 px-3 rounded-lg ${confirmed ? 'bg-success/5' : 'bg-elevated'}`}>
      <span className="text-xs text-text-muted w-8 shrink-0">S{setNumber}</span>

      <div className="flex-1 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          placeholder={lastWeight ? `${lastWeight}` : 'lbs'}
          value={weight}
          onChange={e => setWeight(e.target.value)}
          disabled={confirmed}
          className="w-16 bg-bg border border-border rounded px-2 py-1.5 text-sm text-center disabled:opacity-50 focus:border-accent focus:outline-none"
        />
        <span className="text-text-muted text-xs">x</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder={targetReps}
          value={reps}
          onChange={e => setReps(e.target.value)}
          disabled={confirmed}
          className="w-14 bg-bg border border-border rounded px-2 py-1.5 text-sm text-center disabled:opacity-50 focus:border-accent focus:outline-none"
        />
      </div>

      {lastWeight && !confirmed && (
        <span className="text-[10px] text-text-muted shrink-0">
          Last: {lastWeight}x{lastReps}
        </span>
      )}

      {isPR && <PRBadge />}

      {!confirmed ? (
        <button
          onClick={handleConfirm}
          disabled={saving || !weight || !reps}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-accent/20 text-accent disabled:opacity-30 hover:bg-accent/30 transition-default"
        >
          {saving ? (
            <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      ) : (
        <svg className="w-5 h-5 text-success shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );
}
