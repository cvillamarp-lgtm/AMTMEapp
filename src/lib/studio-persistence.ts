import { initialStudioState } from '@/lib/studio-data';
import { getStudioStateKey } from '@/lib/supabase/env';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/supabase/database.types';
import type { StudioState } from '@/lib/studio-types';

const STUDIO_STATE_SCHEMA_VERSION = 1;

type StudioStatePayload = {
  state: StudioState | null;
  updatedAt: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStudioState(value: unknown): value is StudioState {
  if (!isRecord(value)) {
    return false;
  }

  return 'config' in value && 'episodes' in value && 'masterSections' in value;
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

  if (!isStudioState(data.payload)) {
    throw new Error('El estado remoto no tiene un formato compatible.');
  }

  return {
    state: data.payload,
    updatedAt: data.updated_at,
  };
}

export async function saveStudioStateToRemote(ownerId: string, state: StudioState): Promise<{ updatedAt: string }> {
  const client = getServiceClientOrThrow();
  const updatedAt = new Date().toISOString();
  const nextState = isStudioState(state) ? state : initialStudioState;

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