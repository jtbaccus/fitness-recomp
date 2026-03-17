'use client';

interface WeekPhaseCardProps {
  week: number;
  phase: string;
  label: string;
}

export default function WeekPhaseCard({ week, phase, label }: WeekPhaseCardProps) {
  const progress = Math.min((week / 12) * 100, 100);
  const phaseColors: Record<string, string> = {
    foundation: 'text-accent',
    progression: 'text-amber',
    push: 'text-warning',
  };

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">
          Week {week} <span className="text-text-secondary font-normal">of 12</span>
        </h2>
        <span className={`text-sm font-semibold ${phaseColors[phase] || 'text-accent'}`}>
          {label} Phase
        </span>
      </div>
      <div className="h-2 bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {week === 0 && (
        <p className="text-xs text-text-muted mt-2">Program starts March 24</p>
      )}
    </div>
  );
}
