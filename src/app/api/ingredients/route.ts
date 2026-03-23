import { NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch } from '@/lib/supabase-helpers';
import * as localStore from '@/lib/local-store';
import type { Ingredient } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json(localStore.getIngredients());
  }

  try {
    const data = await supabaseFetch<Ingredient[]>('ingredients?order=category,name');
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
