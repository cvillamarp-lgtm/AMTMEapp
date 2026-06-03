import { useState } from 'react';
import { toast } from 'sonner';

export function useOptimisticList<T extends { id: string }>(initial: T[]) {
  const [items, setItems] = useState<T[]>(initial);

  async function optimisticUpdate(id: string, patch: Partial<T>, fn: () => Promise<T>) {
    const prev = items;
    setItems((current) => current.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    try {
      const result = await fn();
      setItems((current) => current.map((i) => (i.id === id ? result : i)));
    } catch {
      setItems(prev);
      toast.error('Error al guardar — cambios revertidos');
    }
  }

  async function optimisticCreate(temp: T, fn: () => Promise<T>) {
    const prev = items;
    setItems((current) => [temp, ...current]);
    try {
      const result = await fn();
      setItems((current) => current.map((i) => (i.id === temp.id ? result : i)));
    } catch {
      setItems(prev);
      toast.error('Error al crear — cambios revertidos');
    }
  }

  async function optimisticRemove(id: string, fn: () => Promise<void>) {
    const prev = items;
    setItems((current) => current.filter((i) => i.id !== id));
    try {
      await fn();
    } catch {
      setItems(prev);
      toast.error('Error al eliminar — cambios revertidos');
    }
  }

  return { items, setItems, optimisticUpdate, optimisticCreate, optimisticRemove };
}
