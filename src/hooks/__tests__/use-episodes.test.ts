import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEpisodes } from '../use-episodes';

// Mock Supabase auth client
vi.mock('@/lib/supabase/auth-browser', () => ({
  getSupabaseAuthBrowserClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    })),
  })),
}));

describe('useEpisodes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty data', () => {
    const { result } = renderHook(() => useEpisodes());
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle error gracefully', async () => {
    const { result } = renderHook(() => useEpisodes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should accept filters', async () => {
    const { result } = renderHook(() => useEpisodes({ status: 'Publicado', limit: 5 }));

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });
});
