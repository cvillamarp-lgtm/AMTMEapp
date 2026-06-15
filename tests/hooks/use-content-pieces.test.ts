import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useContentPieces } from '@/hooks/use-content-pieces';

describe('useContentPieces', () => {
  it('initializes with empty data array', () => {
    const { result } = renderHook(() => useContentPieces());
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('has loading state', () => {
    const { result } = renderHook(() => useContentPieces());
    expect(typeof result.current.loading).toBe('boolean');
  });
});
