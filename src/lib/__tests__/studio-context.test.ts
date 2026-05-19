import { describe, it, expect, beforeEach } from 'vitest';
import {
  EpisodeChecklistItemSchema,
  EpisodeChecklistSchema,
  EpisodeWorkspaceStateSchema,
  EpisodeWorkspaceSchema,
  initializeWorkspaceState,
  createWorkspaceFromStudioState,
  studioStateFromWorkspace,
  type EpisodeWorkspace,
} from '../studio-context';

describe('studio-context', () => {
  describe('EpisodeChecklistItemSchema', () => {
    it('validates a checklist item', () => {
      const item = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Record intro',
        completed: false,
        order: 0,
      };
      expect(() => EpisodeChecklistItemSchema.parse(item)).not.toThrow();
    });

    it('sets default completed to false', () => {
      const item = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Record intro',
        order: 0,
      };
      const result = EpisodeChecklistItemSchema.parse(item);
      expect(result.completed).toBe(false);
    });
  });

  describe('EpisodeChecklistSchema', () => {
    it('validates a checklist', () => {
      const checklist = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        episodeId: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Workflow',
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      expect(() => EpisodeChecklistSchema.parse(checklist)).not.toThrow();
    });
  });

  describe('EpisodeWorkspaceStateSchema', () => {
    it('validates workspace state with defaults', () => {
      const state = {
        episodeId: '550e8400-e29b-41d4-a716-446655440001',
      };
      const result = EpisodeWorkspaceStateSchema.parse(state);
      expect(result.status).toBe('draft');
      expect(result.episodeId).toBe('550e8400-e29b-41d4-a716-446655440001');
    });

    it('validates all status values', () => {
      const statuses = ['draft', 'in_progress', 'review', 'published'] as const;
      statuses.forEach((status) => {
        const state = {
          episodeId: '550e8400-e29b-41d4-a716-446655440001',
          status,
        };
        expect(() => EpisodeWorkspaceStateSchema.parse(state)).not.toThrow();
      });
    });
  });

  describe('EpisodeWorkspaceSchema', () => {
    it('validates a complete workspace', () => {
      const workspace = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        episodeId: '550e8400-e29b-41d4-a716-446655440001',
        ownerId: '550e8400-e29b-41d4-a716-446655440002',
        state: {
          episodeId: '550e8400-e29b-41d4-a716-446655440001',
          status: 'draft' as const,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schemaVersion: 1,
      };
      expect(() => EpisodeWorkspaceSchema.parse(workspace)).not.toThrow();
    });
  });

  describe('initializeWorkspaceState', () => {
    it('creates workspace state with empty checklist', () => {
      const episodeId = '550e8400-e29b-41d4-a716-446655440001';
      const state = initializeWorkspaceState(episodeId);

      expect(state.episodeId).toBe(episodeId);
      expect(state.status).toBe('draft');
      expect(state.checklist).toBeDefined();
      expect(state.checklist?.title).toBe('Workflow');
      expect(state.checklist?.items).toEqual([]);
    });

    it('creates valid UUID for checklist', () => {
      const state = initializeWorkspaceState('550e8400-e29b-41d4-a716-446655440001');
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(state.checklist?.id).toMatch(uuidRegex);
    });

    it('validates generated state against schema', () => {
      const state = initializeWorkspaceState('550e8400-e29b-41d4-a716-446655440001');
      expect(() => EpisodeWorkspaceStateSchema.parse(state)).not.toThrow();
    });
  });

  describe('createWorkspaceFromStudioState', () => {
    it('creates workspace from studio state', () => {
      const studioState = {
        key: 'workspace-123',
        owner_id: '550e8400-e29b-41d4-a716-446655440002',
        payload: {
          episodeId: '550e8400-e29b-41d4-a716-446655440001',
          status: 'draft',
        },
        schema_version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const workspace = createWorkspaceFromStudioState(
        studioState,
        '550e8400-e29b-41d4-a716-446655440001'
      );

      expect(workspace.id).toBe('workspace-123');
      expect(workspace.ownerId).toBe('550e8400-e29b-41d4-a716-446655440002');
      expect(workspace.state.status).toBe('draft');
    });

    it('handles payload without status', () => {
      const studioState = {
        key: 'workspace-123',
        owner_id: '550e8400-e29b-41d4-a716-446655440002',
        payload: {},
        schema_version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const workspace = createWorkspaceFromStudioState(
        studioState,
        '550e8400-e29b-41d4-a716-446655440001'
      );

      expect(workspace.state.status).toBe('draft');
    });
  });

  describe('studioStateFromWorkspace', () => {
    let workspace: EpisodeWorkspace;

    beforeEach(() => {
      workspace = {
        id: 'workspace-123',
        episodeId: '550e8400-e29b-41d4-a716-446655440001',
        ownerId: '550e8400-e29b-41d4-a716-446655440002',
        state: {
          episodeId: '550e8400-e29b-41d4-a716-446655440001',
          status: 'in_progress',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schemaVersion: 1,
      };
    });

    it('converts workspace to studio state', () => {
      const studioState = studioStateFromWorkspace(workspace);

      expect(studioState.key).toBe('workspace-123');
      expect(studioState.owner_id).toBe('550e8400-e29b-41d4-a716-446655440002');
      expect(studioState.payload.episodeId).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(studioState.payload.status).toBe('in_progress');
    });

    it('preserves timestamps', () => {
      const studioState = studioStateFromWorkspace(workspace);

      expect(studioState.created_at).toBe(workspace.createdAt);
      expect(studioState.updated_at).toBe(workspace.updatedAt);
    });
  });
});
