import { NextResponse } from 'next/server';
import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';
import { isSupabaseServerConfigured } from '@/lib/supabase/env';
import { isAuthRequired } from '@/lib/supabase/env';
import { loadStudioStateFromRemote, saveStudioStateToRemote } from '@/lib/studio-persistence';
import type { StudioState } from '@/lib/studio-types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function resolveOwnerId() {
  if (!isAuthRequired()) {
    return 'public';
  }

  const client = await getSupabaseAuthServerClient();

  if (!client) {
    return null;
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  return user?.id ?? null;
}

export async function GET() {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ success: false, error: 'Supabase no esta configurado en el servidor.' }, { status: 503 });
  }

  try {
    const ownerId = await resolveOwnerId();

    if (!ownerId) {
      return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
    }

    const result = await loadStudioStateFromRemote(ownerId);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar el estado remoto.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ success: false, error: 'Supabase no esta configurado en el servidor.' }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as unknown;

  if (!isRecord(body) || !('state' in body)) {
    return NextResponse.json({ success: false, error: 'Se requiere un estado valido para guardar.' }, { status: 400 });
  }

  try {
    const ownerId = await resolveOwnerId();

    if (!ownerId) {
      return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
    }

    const result = await saveStudioStateToRemote(ownerId, body.state as StudioState);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'No se pudo guardar el estado remoto.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}