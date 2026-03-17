import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { Milestone } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getMilestones());
  }

  try {
    const data = await supabaseFetch<Milestone[]>('milestones?order=target_date.asc');
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
    const m = localStore.updateMilestone(id, updates);
    if (!m) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(m);
  }

  try {
    const data = await supabaseFetch<Milestone[]>(
      `milestones?id=eq.${id}`,
      { method: 'PATCH', body: updates, headers: { 'Prefer': 'return=representation' } }
    );
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
