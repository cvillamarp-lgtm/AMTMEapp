import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getMetricNotes,
  upsertMetricNote,
  deleteMetricNote,
  migrateMetricsLocalStorageToSupabase,
  getDecisionNote,
  saveDecisionNote,
  getAIReports,
  saveAIReports,
  type MetricNoteKind,
} from '@/lib/metrics-persistence';

// Mock Supabase auth client
const mockSupabaseClient = {
  auth: {
    getSession: vi.fn(),
  },
  from: vi.fn(),
};

vi.mock('@/lib/supabase/auth-browser', () => ({
  getSupabaseAuthBrowserClient: vi.fn(() => mockSupabaseClient),
}));

describe('metrics-persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('getMetricNotes', () => {
    it('returns empty array when Supabase is not configured', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce(null);
      const result = await getMetricNotes();
      expect(result).toEqual([]);
    });

    it('returns empty array when user is not authenticated', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
      });
      const result = await getMetricNotes();
      expect(result).toEqual([]);
    });

    it('returns metric notes when query succeeds', async () => {
      const userId = '12345';
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: { id: userId } } },
      });

      const mockData = [
        {
          id: 'note-1',
          user_id: userId,
          kind: 'decision_note' as MetricNoteKind,
          item_key: 'item-1',
          month_key: null,
          payload: { test: 'data' },
          created_at: '2026-06-19T00:00:00Z',
          updated_at: '2026-06-19T00:00:00Z',
        },
      ];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };
      mockQuery.order.mockResolvedValueOnce({ data: mockData, error: null });

      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      const result = await getMetricNotes('decision_note');
      expect(result).toEqual(mockData);
    });
  });

  describe('upsertMetricNote', () => {
    it('returns null when Supabase is not configured', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce(null);
      const result = await upsertMetricNote({
        kind: 'decision_note',
        item_key: 'test',
        payload: {},
      });
      expect(result).toBeNull();
    });

    it('upserts metric note successfully', async () => {
      const userId = '12345';
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: { id: userId } } },
      });

      const mockRecord = {
        id: 'new-note-1',
        user_id: userId,
        kind: 'decision_note' as MetricNoteKind,
        item_key: 'test-key',
        month_key: null,
        payload: { test: 'data' },
        created_at: '2026-06-19T00:00:00Z',
        updated_at: '2026-06-19T00:00:00Z',
      };

      const mockSingleResult = {
        data: mockRecord,
        error: null,
      };

      const mockChain = {
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce(mockSingleResult),
      };

      mockSupabaseClient.from.mockReturnValueOnce(mockChain);

      const result = await upsertMetricNote({
        kind: 'decision_note',
        item_key: 'test-key',
        payload: { test: 'data' },
      });

      expect(result).toEqual(mockRecord);
    });
  });

  describe('migrateMetricsLocalStorageToSupabase', () => {
    it('skips migration if already done in session', async () => {
      sessionStorage.setItem('amtme-metrics-migrated-to-supabase-v1', 'true');
      const result = await migrateMetricsLocalStorageToSupabase();
      expect(result.decisionNotesMigrated).toBe(0);
      expect(result.reportsMigrated).toBe(0);
    });

    it('does not delete original localStorage data', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: { id: '12345' } } },
      });

      const original = { data: 'test' };
      localStorage.setItem('amtme-decision-notes', JSON.stringify(original));

      const mockQuery = {
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
      };
      mockQuery.select.mockResolvedValueOnce({ data: {}, error: null });

      mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

      await migrateMetricsLocalStorageToSupabase();
      expect(localStorage.getItem('amtme-decision-notes')).toBe(JSON.stringify(original));
    });
  });

  describe('saveDecisionNote', () => {
    it('always saves to localStorage', async () => {
      const note = { test: 'data' };
      const result = await saveDecisionNote(note);
      expect(result.localStorage).toBe(true);
      expect(localStorage.getItem('amtme-decision-notes')).toBe(JSON.stringify(note));
    });
  });

  describe('getAIReports', () => {
    it('returns empty array when no data found', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
      });

      const result = await getAIReports();
      expect(result.source).toBe('none');
      expect(result.data).toEqual([]);
    });
  });

  describe('saveAIReports', () => {
    it('always saves to localStorage', async () => {
      const reports = [{ id: '1', month: '2026-06' }];
      const result = await saveAIReports(reports);
      expect(result.localStorage).toBe(true);
      expect(localStorage.getItem('amtme-metric-reports')).toBe(JSON.stringify(reports));
    });
  });
});
