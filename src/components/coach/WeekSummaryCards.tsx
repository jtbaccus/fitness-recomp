'use client';

import { useEffect, useState } from 'react';
import type { CheckIn, NutritionLog } from '@/types/database';

interface SummaryData {
  avgCompliance: number | null;
  avgProtein: number | null;
  proteinTarget: number;
  latestWeight: number | null;
  weightTrend: 'up' | 'down' | 'stable' | null;
}

export default function WeekSummaryCards() {
  const [data, setData] = useState<SummaryData>({
    avgCompliance: null,
    avgProtein: null,
    proteinTarget: 200,
    latestWeight: null,
    weightTrend: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [checkInsRes, nutritionRes] = await Promise.all([
          fetch('/api/checkins'),
          fetch('/api/nutrition'),
        ]);

        const checkIns: CheckIn[] = await checkInsRes.json();
        const nutritionLogs: NutritionLog[] = await nutritionRes.json();

        // Compliance: average of recent check-ins (up to 4)
        const recentCheckIns = checkIns.slice(0, 4);
        const complianceScores = recentCheckIns
          .filter(ci => ci.compliance_score != null)
          .map(ci => ci.compliance_score!);
        const avgCompliance = complianceScores.length > 0
          ? Math.round((complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length) * 10) / 10
          : null;

        // Protein: average of last 7 nutrition logs
        const recentLogs = nutritionLogs.slice(0, 7);
        const avgProtein = recentLogs.length > 0
          ? Math.round(recentLogs.reduce((sum, nl) => sum + nl.protein_g, 0) / recentLogs.length)
          : null;

        // Weight trend: compare last 2 check-ins with weight data
        const withWeight = checkIns.filter(ci => ci.weight_lbs != null);
        const latestWeight = withWeight.length > 0 ? withWeight[0].weight_lbs : null;
        let weightTrend: 'up' | 'down' | 'stable' | null = null;
        if (withWeight.length >= 2) {
          const diff = withWeight[0].weight_lbs! - withWeight[1].weight_lbs!;
          if (diff > 0.5) weightTrend = 'up';
          else if (diff < -0.5) weightTrend = 'down';
          else weightTrend = 'stable';
        }

        setData({
          avgCompliance,
          avgProtein,
          proteinTarget: 200,
          latestWeight,
          weightTrend,
        });
      } catch {
        // silently fail — cards will show dashes
      }
    }

    load();
  }, []);

  const complianceColor = data.avgCompliance == null
    ? 'text-text-muted'
    : data.avgCompliance > 7
      ? 'text-green-400'
      : data.avgCompliance >= 5
        ? 'text-yellow-400'
        : 'text-red-400';

  const trendArrow = data.weightTrend === 'up'
    ? '\u2191'
    : data.weightTrend === 'down'
      ? '\u2193'
      : data.weightTrend === 'stable'
        ? '\u2192'
        : '';

  const trendColor = data.weightTrend === 'up'
    ? 'text-yellow-400'
    : data.weightTrend === 'down'
      ? 'text-green-400'
      : 'text-text-muted';

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Compliance */}
      <div className="bg-card rounded-xl p-3 text-center">
        <p className="text-xs text-text-muted mb-1">Compliance</p>
        <p className={`text-lg font-bold ${complianceColor}`}>
          {data.avgCompliance != null ? data.avgCompliance : '--'}
          <span className="text-xs font-normal text-text-muted">/10</span>
        </p>
      </div>

      {/* Protein */}
      <div className="bg-card rounded-xl p-3 text-center">
        <p className="text-xs text-text-muted mb-1">Avg Protein</p>
        <p className="text-lg font-bold text-white">
          {data.avgProtein != null ? `${data.avgProtein}g` : '--'}
          <span className="text-xs font-normal text-text-muted"> / {data.proteinTarget}g</span>
        </p>
        {data.avgProtein != null && (
          <div className="mt-1 h-1 bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${Math.min(100, (data.avgProtein / data.proteinTarget) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Weight */}
      <div className="bg-card rounded-xl p-3 text-center">
        <p className="text-xs text-text-muted mb-1">Weight</p>
        <p className="text-lg font-bold text-white">
          {data.latestWeight != null ? `${data.latestWeight}` : '--'}
          {data.latestWeight != null && (
            <span className="text-xs font-normal text-text-muted"> lbs</span>
          )}
        </p>
        {trendArrow && (
          <p className={`text-xs font-semibold ${trendColor}`}>{trendArrow}</p>
        )}
      </div>
    </div>
  );
}
