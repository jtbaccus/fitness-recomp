import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { LiftingTarget } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getLiftingTargets());
  }

  try {
    const data = await supabaseFetch<LiftingTarget[]>('lifting_targets?order=exercise_name.asc');
    return NextResponse.json(data);
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
    const t = localStore.updateLiftingTarget(id, updates);
    if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(t);
  }

  try {
    const data = await supabaseFetch<LiftingTarget[]>(
      `lifting_targets?id=eq.${id}`,
      { method: 'PATCH', body: { ...updates, updated_at: new Date().toISOString() }, headers: { 'Prefer': 'return=representation' } }
    );
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
