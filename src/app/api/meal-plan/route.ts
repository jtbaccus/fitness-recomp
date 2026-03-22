import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { MealPlanEntry } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  const start = request.nextUrl.searchParams.get('start');
  const end = request.nextUrl.searchParams.get('end');
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getMealPlan(date || undefined, start || undefined, end || undefined));
  }

  try {
    let path = 'meal_plan?order=date,meal_slot';
    if (date) path += `&date=eq.${date}`;
    if (start) path += `&date=gte.${start}`;
    if (end) path += `&date=lte.${end}`;
    const data = await supabaseFetch<MealPlanEntry[]>(path);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const entry = localStore.createMealPlanEntry(body);
    return NextResponse.json(entry);
  }

  try {
    const data = await supabaseFetch<MealPlanEntry[]>('meal_plan', {
      method: 'POST',
      body,
      headers: { 'Prefer': 'return=representation' },
    });
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const ok = localStore.deleteMealPlanEntry(id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  }

  try {
    await supabaseFetch(`meal_plan?id=eq.${id}`, { method: 'DELETE' });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
