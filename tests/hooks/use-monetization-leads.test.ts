import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMonetizationLeads } from '@/hooks/use-monetization-leads';

describe('useMonetizationLeads', () => {
  it('initializes with empty data array', () => {
    const { result } = renderHook(() => useMonetizationLeads());
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('has loading state', () => {
    const { result } = renderHook(() => useMonetizationLeads());
    expect(typeof result.current.loading).toBe('boolean');
  });
});
