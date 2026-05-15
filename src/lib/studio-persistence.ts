import { formatZodError, studioStateSchema } from '@/lib/schemas';
import { getStudioStateKey } from '@/lib/supabase/env';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/supabase/database.types';
import type { StudioState } from '@/lib/studio-types';

const STUDIO_STATE_SCHEMA_VERSION = 1;

type StudioStatePayload = {
  state: StudioState | null;
  updatedAt: string | null;
};

function parseStudioStateOrThrow(value: unknown): StudioState {
  const parsed = studioStateSchema.safeParse(value);

  if (!parsed.success) {
    throw new Error(`StudioState inválido: ${formatZodError(parsed.error)}`);
  }

  return parsed.data as StudioState;
}

function getServiceClientOrThrow() {
  const client = getSupabaseServiceRoleClient();

  if (!client) {
    throw new Error('Supabase no esta configurado en el servidor.');
  }

  return client;
}

export async function loadStudioStateFromRemote(ownerId: string): Promise<StudioStatePayload> {
  const client = getServiceClientOrThrow();
  const { data, error } = await client
    .from('studio_state')
    .select('payload, updated_at')
    .eq('owner_id', ownerId)
    .eq('key', getStudioStateKey())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return {
      state: null,
      updatedAt: null,
    };
  }

  return {
    state: parseStudioStateOrThrow(data.payload),
    updatedAt: data.updated_at,
  };
}

export async function saveStudioStateToRemote(ownerId: string, state: StudioState): Promise<{ updatedAt: string }> {
  const client = getServiceClientOrThrow();
  const updatedAt = new Date().toISOString();
  const nextState = parseStudioStateOrThrow(state);

  const { data, error } = await client
    .from('studio_state')
    .upsert(
      {
        key: getStudioStateKey(),
        owner_id: ownerId,
        payload: nextState as unknown as Json,
        schema_version: STUDIO_STATE_SCHEMA_VERSION,
        updated_at: updatedAt,
      },
      { onConflict: 'owner_id,key' },
    )
    .select('updated_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    updatedAt: data.updated_at,
  };
}
