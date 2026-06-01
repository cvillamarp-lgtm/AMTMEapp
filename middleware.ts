import { NextResponse, type NextRequest } from 'next/server';
import { refreshSession } from '@/lib/supabase/auth-middleware';
import { isAuthRequired } from '@/lib/supabase/env';

function isAuthPath(pathname: string) {
  return pathname.startsWith('/auth');
}

function isPublicRoute(pathname: string) {
  return pathname === '/' || pathname.startsWith('/api/public');
}

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith('/_next')
    || pathname.startsWith('/favicon')
    || pathname.includes('.')
  );
}

export async function middleware(request: NextRequest) {
  if (isPublicAsset(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Rutas publicas siempre pasan sin auth
  if (isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { user, response } = await refreshSession(request);

  if (!isAuthRequired()) {
    return response;
  }

  if (isAuthPath(request.nextUrl.pathname)) {
    return response;
  }

  if (isPublicRoute(request.nextUrl.pathname)) {
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};// Mon Jun  1 01:31:03 EST 2026
