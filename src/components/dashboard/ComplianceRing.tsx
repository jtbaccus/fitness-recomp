'use client';

interface ComplianceRingProps {
  completed: number;
  total: number;
}

export default function ComplianceRing({ completed, total }: ComplianceRingProps) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-card rounded-xl p-4 flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="40"
            fill="none" stroke="#262626" strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="40"
            fill="none" stroke="#3b82f6" strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">{completed}/{total}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold">Weekly Sessions</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {completed === total && total > 0 ? 'All done!' : `${total - completed} remaining`}
        </p>
      </div>
    </div>
  );
}
