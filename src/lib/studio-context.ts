import { z } from 'zod';
import { StudioStateRow, StudioStateInsert } from './zod/studio-state.schema';

// Episode workspace domain types
export const EpisodeChecklistItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  completed: z.boolean().default(false),
  order: z.number().int().nonnegative(),
});

export const EpisodeChecklistSchema = z.object({
  id: z.string().uuid(),
  episodeId: z.string().uuid(),
  title: z.string(),
  items: z.array(EpisodeChecklistItemSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const EpisodeWorkspaceStateSchema = z.object({
  episodeId: z.string().uuid(),
  status: z.enum(['draft', 'in_progress', 'review', 'published']).default('draft'),
  checklist: EpisodeChecklistSchema.optional(),
  lastModifiedBy: z.string().uuid().optional(),
  lastModifiedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const EpisodeWorkspaceSchema = z.object({
  id: z.string().uuid(),
  episodeId: z.string().uuid(),
  ownerId: z.string().uuid(),
  state: EpisodeWorkspaceStateSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  schemaVersion: z.number().int().positive().default(1),
});

// Type exports
export type EpisodeChecklistItem = z.infer<typeof EpisodeChecklistItemSchema>;
export type EpisodeChecklist = z.infer<typeof EpisodeChecklistSchema>;
export type EpisodeWorkspaceState = z.infer<typeof EpisodeWorkspaceStateSchema>;
export type EpisodeWorkspace = z.infer<typeof EpisodeWorkspaceSchema>;

// Utility functions for workspace operations
export function initializeWorkspaceState(episodeId: string): EpisodeWorkspaceState {
  return {
    episodeId,
    status: 'draft',
    checklist: {
      id: crypto.randomUUID(),
      episodeId,
      title: 'Workflow',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function createWorkspaceFromStudioState(
  studioState: StudioStateRow,
  episodeId: string
): EpisodeWorkspace {
  const payload = studioState.payload as Partial<EpisodeWorkspaceState>;
  const state = EpisodeWorkspaceStateSchema.parse({
    episodeId,
    status: payload.status ?? 'draft',
    checklist: payload.checklist,
    lastModifiedBy: payload.lastModifiedBy,
    lastModifiedAt: payload.lastModifiedAt,
    notes: payload.notes,
  });

  return {
    id: studioState.key,
    episodeId,
    ownerId: studioState.owner_id,
    state,
    createdAt: studioState.created_at,
    updatedAt: studioState.updated_at,
    schemaVersion: studioState.schema_version,
  };
}

export function studioStateFromWorkspace(workspace: EpisodeWorkspace): StudioStateInsert {
  return {
    key: workspace.id,
    owner_id: workspace.ownerId,
    payload: workspace.state,
    schema_version: workspace.schemaVersion,
    created_at: workspace.createdAt,
    updated_at: workspace.updatedAt,
  };
}
