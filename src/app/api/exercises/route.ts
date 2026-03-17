import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { ExerciseLog } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getExerciseLogs(sessionId || undefined));
  }

  try {
    let path = 'exercise_logs?order=set_number.asc';
    if (sessionId) path += `&session_id=eq.${sessionId}`;
    const data = await supabaseFetch<ExerciseLog[]>(path);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const result = localStore.createExerciseLog(body);
    return NextResponse.json(result);
  }

  try {
    // 1. Insert the log
    const inserted = await supabaseFetch<ExerciseLog[]>('exercise_logs', {
      method: 'POST',
      body: { ...body, is_pr: false },
      headers: { 'Prefer': 'return=representation' },
    });

    const log = inserted[0];

    // 2. Check for PR — compare estimated 1RM
    const allLogs = await supabaseFetch<ExerciseLog[]>(
      `exercise_logs?exercise_name=eq.${encodeURIComponent(body.exercise_name)}&id=neq.${log.id}&order=created_at.desc`
    );

    const newE1RM = body.weight_lbs * (1 + body.reps / 30);
    const previousMaxE1RM = allLogs.reduce((max: number, l: ExerciseLog) => {
      return Math.max(max, l.weight_lbs * (1 + l.reps / 30));
    }, 0);

    const isPR = body.weight_lbs > 0 && allLogs.length > 0 && newE1RM > previousMaxE1RM;

    if (isPR) {
      // Update the log to mark as PR
      await supabaseFetch(`exercise_logs?id=eq.${log.id}`, {
        method: 'PATCH',
        body: { is_pr: true },
      });

      // Update lifting target current_max
      await supabaseFetch(
        `lifting_targets?exercise_name=eq.${encodeURIComponent(body.exercise_name)}`,
        { method: 'PATCH', body: { current_max: body.weight_lbs, updated_at: new Date().toISOString() } }
      );
    }

    return NextResponse.json({ ...log, is_pr: isPR });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
