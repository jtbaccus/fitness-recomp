import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { NutritionLog } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getNutritionLogs(date || undefined));
  }

  try {
    let path = 'nutrition_logs?order=date.desc';
    if (date) path += `&date=eq.${date}`;
    const data = await supabaseFetch<NutritionLog[]>(path);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const log = localStore.upsertNutritionLog(body);
    return NextResponse.json(log);
  }

  try {
    // Upsert by date
    const existing = await supabaseFetch<NutritionLog[]>(
      `nutrition_logs?date=eq.${body.date}`
    );

    if (existing.length > 0) {
      const updated = await supabaseFetch<NutritionLog[]>(
        `nutrition_logs?id=eq.${existing[0].id}`,
        { method: 'PATCH', body, headers: { 'Prefer': 'return=representation' } }
      );
      return NextResponse.json(updated[0]);
    }

    const created = await supabaseFetch<NutritionLog[]>('nutrition_logs', {
      method: 'POST',
      body,
      headers: { 'Prefer': 'return=representation' },
    });
    return NextResponse.json(created[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
