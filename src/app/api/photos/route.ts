import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseFetch, supabaseStorageUpload } from '@/lib/supabase-helpers';
import type { ProgressPhoto } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json([]);
  }

  try {
    let path = 'progress_photos?order=date.desc';
    if (date) path += `&date=eq.${date}`;
    const data = await supabaseFetch<ProgressPhoto[]>(path);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.json({ error: 'Photo upload requires Supabase' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const date = formData.get('date') as string;
    const photoType = formData.get('photo_type') as string;

    if (!file || !date || !photoType) {
      return NextResponse.json({ error: 'file, date, and photo_type required' }, { status: 400 });
    }

    const storagePath = `${date}/${photoType}.${file.name.split('.').pop()}`;
    await supabaseStorageUpload('progress-photos', storagePath, file, file.type);

    const created = await supabaseFetch<ProgressPhoto[]>('progress_photos', {
      method: 'POST',
      body: { date, photo_type: photoType, storage_path: storagePath },
      headers: { 'Prefer': 'return=representation' },
    });

    return NextResponse.json(created[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
