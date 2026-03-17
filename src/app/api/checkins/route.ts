import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { CheckIn } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const latest = request.nextUrl.searchParams.get('latest');
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getCheckIns(!!latest));
  }

  try {
    let path = 'check_ins?order=date.desc';
    if (latest) path += '&limit=1';
    const data = await supabaseFetch<CheckIn[]>(path);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    const ci = localStore.createCheckIn(body);
    return NextResponse.json(ci);
  }

  try {
    const data = await supabaseFetch<CheckIn[]>('check_ins', {
      method: 'POST',
      body,
      headers: { 'Prefer': 'return=representation' },
    });
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
