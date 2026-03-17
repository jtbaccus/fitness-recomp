import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { WorkoutSession } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getWorkoutSessions(date || undefined));
  }

  try {
    let path = 'workout_sessions?order=date.desc';
    if (date) path += `&date=eq.${date}`;
    const data = await supabaseFetch<WorkoutSession[]>(path);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const session = localStore.createWorkoutSession(body);
    return NextResponse.json(session);
  }

  try {
    const data = await supabaseFetch<WorkoutSession[]>('workout_sessions', {
      method: 'POST',
      body,
      headers: { 'Prefer': 'return=representation' },
    });
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const session = localStore.updateWorkoutSession(id, updates);
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(session);
  }

  try {
    const data = await supabaseFetch<WorkoutSession[]>(
      `workout_sessions?id=eq.${id}`,
      { method: 'PATCH', body: updates, headers: { 'Prefer': 'return=representation' } }
    );
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
