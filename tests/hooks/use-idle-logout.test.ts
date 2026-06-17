import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIdleLogout } from '@/hooks/use-idle-logout';

// Mock supabase auth client
vi.mock('@/lib/supabase/auth-browser', () => ({
  getSupabaseAuthBrowserClient: vi.fn(() => ({
    auth: {
      signOut: vi.fn().mockResolvedValue(undefined),
    },
  })),
}));

describe('useIdleLogout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with disabled state', () => {
    const { result } = renderHook(() => useIdleLogout({ enabled: false }));
    expect(result.current.showWarning).toBe(false);
    expect(result.current.remainingSeconds).toBe(0);
  });

  it('shows warning when enabled', () => {
    const { result } = renderHook(() =>
      useIdleLogout({ enabled: true, idleMs: 300000, warningMs: 240000 })
    );

    act(() => {
      vi.advanceTimersByTime(240000);
    });

    expect(result.current.showWarning).toBe(true);
  });

  it('keepSession resets warning', () => {
    const { result } = renderHook(() =>
      useIdleLogout({ enabled: true, idleMs: 300000, warningMs: 240000 })
    );

    act(() => {
      vi.advanceTimersByTime(240000);
    });
    expect(result.current.showWarning).toBe(true);

    act(() => {
      result.current.keepSession();
    });
    expect(result.current.showWarning).toBe(false);
  });

  it('returns remaining seconds during countdown', () => {
    const { result } = renderHook(() =>
      useIdleLogout({ enabled: true, idleMs: 300000, warningMs: 240000 })
    );

    act(() => {
      vi.advanceTimersByTime(240000);
    });

    expect(result.current.remainingSeconds).toBeGreaterThan(0);
    expect(result.current.remainingSeconds).toBeLessThanOrEqual(60);
  });
});
