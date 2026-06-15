import { NextResponse } from 'next/server';
import { formatZodError, studioStatePutBodySchema } from '@/lib/schemas';
import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';
import { isSupabaseServerConfigured } from '@/lib/supabase/env';
import { loadStudioStateFromRemote, saveStudioStateToRemote } from '@/lib/studio-persistence';

// P0 FIX: studio_state ya no admite un owner compartido ('public').
// Cada usuario solo puede leer/escribir su propio estado remoto.
// Sin sesión activa -> 401, el cliente debe operar en modo local/demo.
async function resolveOwnerId(): Promise<string | null> {
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
    return NextResponse.json(
      { success: false, error: 'Supabase no esta configurado en el servidor.' },
      { status: 503 }
    );
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
    return NextResponse.json(
      { success: false, error: 'Supabase no esta configurado en el servidor.' },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsedBody = studioStatePutBodySchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { success: false, error: `Payload inválido: ${formatZodError(parsedBody.error)}` },
      { status: 400 }
    );
  }

  try {
    const ownerId = await resolveOwnerId();

    if (!ownerId) {
      return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
    }

    const result = await saveStudioStateToRemote(ownerId, parsedBody.data.state);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'No se pudo guardar el estado remoto.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
