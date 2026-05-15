import type { StudioState } from '@/lib/studio-types';
import { formatZodError, studioStateSchema } from '@/lib/schemas';

export function exportStudioStateToJson(state: StudioState): string {
  const parsed = studioStateSchema.parse(state);
  return JSON.stringify(parsed, null, 2);
}

export function importStudioStateFromJson(json: string):
  | { success: true; state: StudioState }
  | { success: false; error: string } {
  let payload: unknown;

  try {
    payload = JSON.parse(json);
  } catch {
    return { success: false, error: 'El JSON de respaldo no es válido.' };
  }

  const parsed = studioStateSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      error: `El respaldo no tiene un formato de StudioState válido: ${formatZodError(parsed.error)}`,
    };
  }

  return { success: true, state: parsed.data as StudioState };
}
