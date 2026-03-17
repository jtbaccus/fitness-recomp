import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { ExerciseLog } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const exerciseName = request.nextUrl.searchParams.get('exercise_name');
  if (!exerciseName) {
    return NextResponse.json({ error: 'exercise_name required' }, { status: 400 });
  }

  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getLastExerciseLogs(exerciseName));
  }

  try {
    // Get the most recent log for this exercise to find its session_id
    const recent = await supabaseFetch<ExerciseLog[]>(
      `exercise_logs?exercise_name=eq.${encodeURIComponent(exerciseName)}&order=created_at.desc&limit=1`
    );

    if (recent.length === 0) {
      return NextResponse.json([]);
    }

    // Get all logs from that session for this exercise
    const sessionId = recent[0].session_id;
    const logs = await supabaseFetch<ExerciseLog[]>(
      `exercise_logs?session_id=eq.${sessionId}&exercise_name=eq.${encodeURIComponent(exerciseName)}&order=set_number.asc`
    );

    return NextResponse.json(logs);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
