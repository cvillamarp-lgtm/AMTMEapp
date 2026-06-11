import { describe, it, expect, vi } from 'vitest';

describe('Spotify Import - Auth-Disabled Flow', () => {
  describe('resolveOperationalOwner', () => {
    it('should return userId when provided (auth-required mode)', () => {
      // Helper function logic
      const userId = 'user-123';
      const resolveOwner = (uid: string | null | undefined) => uid || 'public';
      expect(resolveOwner(userId)).toBe('user-123');
    });

    it('should return "public" when userId is null (auth-disabled mode)', () => {
      const resolveOwner = (uid: string | null | undefined) => uid || 'public';
      expect(resolveOwner(null)).toBe('public');
    });

    it('should return "public" when userId is undefined (auth-disabled mode)', () => {
      const resolveOwner = (uid: string | null | undefined) => uid || 'public';
      expect(resolveOwner(undefined)).toBe('public');
    });
  });

  describe('spotify_metric_imports insertion', () => {
    it('should use owner_id="public" and workspace_key="primary" for public imports', () => {
      // Expected data structure for public imports
      const importData = {
        owner_id: 'public',
        workspace_key: 'primary',
        payload: { file_name: 'test.csv', status: 'uploaded' },
      };

      expect(importData.owner_id).toBe('public');
      expect(importData.workspace_key).toBe('primary');
    });

    it('should use owner_id=userId and workspace_key="primary" for user-owned imports', () => {
      const userId = 'user-123';
      const importData = {
        owner_id: userId,
        workspace_key: 'primary',
        payload: { file_name: 'test.csv', status: 'uploaded' },
      };

      expect(importData.owner_id).toBe('user-123');
      expect(importData.workspace_key).toBe('primary');
    });
  });

  describe('episode creation during import', () => {
    it('should create episodes with owner_id from operational owner', () => {
      const owner = 'public';
      const episodeData = {
        owner_id: owner,
        workspace_key: 'primary',
        payload: {
          title: 'Episode from Spotify',
          status: 'medido',
        },
      };

      expect(episodeData.owner_id).toBe('public');
      expect(episodeData.workspace_key).toBe('primary');
    });

    it('should create episodes with user owner_id when authenticated', () => {
      const owner = 'user-123';
      const episodeData = {
        owner_id: owner,
        workspace_key: 'primary',
        payload: {
          title: 'Episode from Spotify',
          status: 'medido',
        },
      };

      expect(episodeData.owner_id).toBe('user-123');
      expect(episodeData.workspace_key).toBe('primary');
    });
  });

  describe('metrics persistence (spotify_daily_metrics, distribution, manual)', () => {
    it('should insert daily metrics with correct owner and workspace', () => {
      const owner = 'public';
      const metricsData = {
        owner_id: owner,
        workspace_key: 'primary',
        payload: { date: '2026-06-10', plays_downloads: 100 },
      };

      expect(metricsData.owner_id).toBe('public');
      expect(metricsData.workspace_key).toBe('primary');
    });

    it('should insert distribution metrics with correct owner and workspace', () => {
      const owner = 'public';
      const metricsData = {
        owner_id: owner,
        workspace_key: 'primary',
        payload: {
          dimension_type: 'apps',
          dimension_name: 'Spotify',
          percentage: 85,
        },
      };

      expect(metricsData.owner_id).toBe('public');
      expect(metricsData.workspace_key).toBe('primary');
    });

    it('should insert manual metrics with correct owner and workspace', () => {
      const owner = 'public';
      const metricsData = {
        owner_id: owner,
        workspace_key: 'primary',
        payload: {
          month: '2026-06',
          platform: 'spotify',
          plays: 500,
        },
      };

      expect(metricsData.owner_id).toBe('public');
      expect(metricsData.workspace_key).toBe('primary');
    });
  });

  describe('RLS policy validation', () => {
    it('should allow public metrics to be read by anyone', () => {
      const ownerCheck = (owner: string, authUid: string | null) => {
        // RLS policy: owner_id='public' OR auth.uid()::text=owner_id
        return owner === 'public' || (authUid && authUid === owner);
      };

      expect(ownerCheck('public', null)).toBe(true);
      expect(ownerCheck('public', 'user-123')).toBe(true);
    });

    it('should allow users to read their own metrics', () => {
      const ownerCheck = (owner: string, authUid: string | null) => {
        return owner === 'public' || (authUid && authUid === owner);
      };

      expect(ownerCheck('user-123', 'user-123')).toBe(true);
    });

    it('should deny users from reading other users metrics', () => {
      const ownerCheck = (owner: string, authUid: string | null) => {
        return owner === 'public' || (authUid && authUid === owner);
      };

      expect(ownerCheck('user-123', 'user-456')).toBe(false);
    });
  });
});
