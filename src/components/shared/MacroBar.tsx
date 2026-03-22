'use client';

interface MacroBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

export default function MacroBar({ label, value, min, max, unit }: MacroBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 120) : 0;
  const inRange = value >= min && value <= max;
  const over = value > max;
  const color = inRange ? 'bg-success' : over ? 'bg-warning' : 'bg-amber';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className={inRange ? 'text-success' : over ? 'text-warning' : 'text-amber'}>
          {value}{unit} <span className="text-text-muted">/ {min}–{max}</span>
        </span>
      </div>
      <div className="h-2 bg-elevated rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}
