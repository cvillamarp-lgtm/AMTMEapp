type SupabasePublicEnv = {
  anonKey: string;
  url: string;
};

type SupabaseServerEnv = SupabasePublicEnv & {
  serviceRoleKey: string;
};

function hasValue(value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isValidSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.hostname === 'localhost';
  } catch {
    return false;
  }
}

function isValidSupabaseKey(key: string): boolean {
  return key.length >= 32;
}

export function isSupabaseBrowserConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasValue(url) || !hasValue(anonKey)) {
    return false;
  }

  if (!isValidSupabaseUrl(url)) {
    console.error('[Supabase] Invalid NEXT_PUBLIC_SUPABASE_URL format');
    return false;
  }

  if (!isValidSupabaseKey(anonKey)) {
    console.error('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY is too short');
    return false;
  }

  return true;
}

export function isSupabaseServerConfigured(): boolean {
  if (!isSupabaseBrowserConfigured()) {
    return false;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasValue(serviceRoleKey)) {
    console.error('[Supabase] SUPABASE_SERVICE_ROLE_KEY is missing or empty');
    return false;
  }

  if (!isValidSupabaseKey(serviceRoleKey)) {
    console.error('[Supabase] SUPABASE_SERVICE_ROLE_KEY is too short');
    return false;
  }

  return true;
}

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  if (!isSupabaseBrowserConfigured()) {
    return null;
  }

  return {
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  };
}

export function getSupabaseServerEnv(): SupabaseServerEnv | null {
  const publicEnv = getSupabasePublicEnv();

  if (!publicEnv || !hasValue(process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    return null;
  }

  return {
    ...publicEnv,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function getStudioStateKey(): string {
  return process.env.SUPABASE_STUDIO_STATE_KEY ?? 'primary';
}

export function isAuthRequired(): boolean {
  return process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true';
}

export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  if (!isValidSupabaseUrl(siteUrl)) {
    console.warn('[Supabase] NEXT_PUBLIC_SITE_URL has invalid format, using default');
    return 'http://localhost:3000';
  }

  return siteUrl;
}
