import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useOptimisticList } from '@/hooks/use-optimistic-list';

describe('useOptimisticList', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  it('initializes with provided items', () => {
    const { result } = renderHook(() => useOptimisticList(mockItems));
    expect(result.current.items).toEqual(mockItems);
  });

  it('optimistically updates item and reverts on error', async () => {
    const { result } = renderHook(() => useOptimisticList(mockItems));

    const mockFn = vi.fn().mockRejectedValueOnce(new Error('Update failed'));

    await act(async () => {
      await result.current.optimisticUpdate('1', { name: 'Updated' }, mockFn);
    });

    // Should revert to original on error
    expect(result.current.items).toEqual(mockItems);
  });

  it('optimistically updates item on success', async () => {
    const { result } = renderHook(() => useOptimisticList(mockItems));

    const updatedItem = { id: '1', name: 'Updated Item' };
    const mockFn = vi.fn().mockResolvedValueOnce(updatedItem);

    await act(async () => {
      await result.current.optimisticUpdate('1', { name: 'Updated Item' }, mockFn);
    });

    expect(result.current.items[0].name).toBe('Updated Item');
  });

  it('optimistically creates item and reverts on error', async () => {
    const { result } = renderHook(() => useOptimisticList(mockItems));

    const tempItem = { id: 'temp', name: 'New Item' };
    const mockFn = vi.fn().mockRejectedValueOnce(new Error('Create failed'));

    await act(async () => {
      await result.current.optimisticCreate(tempItem, mockFn);
    });

    expect(result.current.items).toEqual(mockItems);
  });

  it('optimistically creates item on success', async () => {
    const { result } = renderHook(() => useOptimisticList(mockItems));

    const tempItem = { id: 'temp', name: 'New Item' };
    const finalItem = { id: '3', name: 'New Item' };
    const mockFn = vi.fn().mockResolvedValueOnce(finalItem);

    await act(async () => {
      await result.current.optimisticCreate(tempItem, mockFn);
    });

    expect(result.current.items.length).toBe(3);
    expect(result.current.items[0]).toEqual(finalItem);
  });

  it('optimistically removes item and reverts on error', async () => {
    const { result } = renderHook(() => useOptimisticList(mockItems));

    const mockFn = vi.fn().mockRejectedValueOnce(new Error('Delete failed'));

    await act(async () => {
      await result.current.optimisticRemove('1', mockFn);
    });

    expect(result.current.items).toEqual(mockItems);
  });

  it('optimistically removes item on success', async () => {
    const { result } = renderHook(() => useOptimisticList(mockItems));

    const mockFn = vi.fn().mockResolvedValueOnce(undefined);

    await act(async () => {
      await result.current.optimisticRemove('1', mockFn);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].id).toBe('2');
  });
});
