'use client';

import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface BodyweightSparklineProps {
  data: { date: string; weight: number }[];
}

export default function BodyweightSparkline({ data }: BodyweightSparklineProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl p-4">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Bodyweight</p>
        <p className="text-sm text-text-secondary">No check-in data yet</p>
      </div>
    );
  }

  const latest = data[data.length - 1];
  const min = Math.min(...data.map(d => d.weight)) - 2;
  const max = Math.max(...data.map(d => d.weight)) + 2;

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-text-muted uppercase tracking-wider">Bodyweight</p>
        <p className="text-lg font-bold">{latest.weight} <span className="text-xs text-text-secondary font-normal">lbs</span></p>
      </div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={[min, max]} hide />
            <Tooltip
              contentStyle={{ background: '#262626', border: 'none', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#a0a0a0' }}
              formatter={(value) => [`${value} lbs`, 'Weight']}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
