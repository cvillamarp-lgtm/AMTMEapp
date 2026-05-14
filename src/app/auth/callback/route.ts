import { NextResponse } from 'next/server';
import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/dashboard';
  const destination = new URL(next, url.origin);

  if (!code) {
    return NextResponse.redirect(destination);
  }

  const supabase = await getSupabaseAuthServerClient();

  if (!supabase) {
    const fallback = new URL('/auth/sign-in', url.origin);
    fallback.searchParams.set('error', 'Supabase no configurado');
    return NextResponse.redirect(fallback);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const fallback = new URL('/auth/sign-in', url.origin);
    fallback.searchParams.set('error', error.message);
    return NextResponse.redirect(fallback);
  }

  return NextResponse.redirect(destination);
}