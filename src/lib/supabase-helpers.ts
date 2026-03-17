// Shared Supabase REST API fetch wrapper
// Bypasses @supabase/supabase-js client caching issues on Vercel

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  return { url, key, isConfigured: !!(url && key) };
}

export async function supabaseFetch<T = unknown>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    throw new Error('Supabase not configured');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: options.method || 'GET',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase error (${response.status}): ${errorText}`);
  }

  const text = await response.text();
  if (!text) return [] as unknown as T;
  return JSON.parse(text);
}

export async function supabaseStorageUpload(
  bucket: string,
  path: string,
  file: Blob,
  contentType: string
): Promise<{ path: string }> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) throw new Error('Supabase not configured');

  const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': contentType,
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Storage upload error (${response.status}): ${errorText}`);
  }

  return { path: `${bucket}/${path}` };
}

export async function supabaseStorageGetUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) throw new Error('Supabase not configured');

  const response = await fetch(`${url}/storage/v1/object/sign/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Storage sign error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return `${url}/storage/v1${data.signedURL}`;
}
