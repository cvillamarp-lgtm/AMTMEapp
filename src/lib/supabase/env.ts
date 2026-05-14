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

export function isSupabaseBrowserConfigured(): boolean {
  return hasValue(process.env.NEXT_PUBLIC_SUPABASE_URL) && hasValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isSupabaseServerConfigured(): boolean {
  return isSupabaseBrowserConfigured() && hasValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
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
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}