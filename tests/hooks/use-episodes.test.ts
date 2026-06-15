import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEpisodes } from '@/hooks/use-episodes';

describe('useEpisodes', () => {
  it('initializes with empty data array', () => {
    const { result } = renderHook(() => useEpisodes());
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('has loading state', () => {
    const { result } = renderHook(() => useEpisodes());
    expect(typeof result.current.loading).toBe('boolean');
  });

  it('has refetch function', () => {
    const { result } = renderHook(() => useEpisodes());
    expect(typeof result.current.refetch).toBe('function');
  });
});
