import { NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { WorkoutSession, ExerciseLog, CheckIn } from '@/types/database';
import { getCurrentWeek, getCurrentPhase, getTodayDayType, toLocalDateString } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const data = localStore.getDashboardData();
    const week = getCurrentWeek();
    const phase = getCurrentPhase(week);
    const todayType = getTodayDayType();
    return NextResponse.json({ week, ...phase, todayType, ...data });
  }

  try {
    const week = getCurrentWeek();
    const phase = getCurrentPhase(week);
    const todayType = getTodayDayType();
    const today = toLocalDateString();

    // Get last session
    const sessions = await supabaseFetch<WorkoutSession[]>(
      'workout_sessions?order=date.desc&limit=1'
    );
    const lastSession = sessions[0] || null;

    let lastSessionExerciseCount = 0;
    if (lastSession) {
      const logs = await supabaseFetch<ExerciseLog[]>(
        `exercise_logs?session_id=eq.${lastSession.id}&select=id`
      );
      lastSessionExerciseCount = logs.length;
    }

    // This week's completed sessions
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const weekStart = toLocalDateString(startOfWeek);
    const weekSessions = await supabaseFetch<WorkoutSession[]>(
      `workout_sessions?date=gte.${weekStart}&date=lte.${today}&completed=eq.true`
    );

    // Recent weights from check-ins
    const recentCheckIns = await supabaseFetch<CheckIn[]>(
      'check_ins?weight_lbs=not.is.null&order=date.desc&limit=8'
    );

    return NextResponse.json({
      week,
      ...phase,
      todayType,
      lastSession,
      lastSessionExerciseCount,
      weeklySessionsCompleted: weekSessions.length,
      latestWeight: recentCheckIns[0]?.weight_lbs || null,
      recentWeights: recentCheckIns
        .map(c => ({ date: c.date, weight: c.weight_lbs! }))
        .reverse(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
