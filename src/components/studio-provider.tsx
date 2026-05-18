'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { initialStudioState } from '@/lib/studio-data';
import { isSupabaseBrowserConfigured } from '@/lib/supabase/env';
import type { StudioState } from '@/lib/studio-types';

type StudioPersistenceMeta = {
  mode: 'local' | 'remote';
  configured: boolean;
  syncing: boolean;
  lastSyncedAt: string | null;
  error: string;
};

type StudioContextValue = {
  state: StudioState;
  setState: Dispatch<SetStateAction<StudioState>>;
  persistence: StudioPersistenceMeta;
};

const StudioContext = createContext<StudioContextValue | undefined>(undefined);

const STORAGE_KEY = 'amtme-studio-os-state';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo sincronizar el estado remoto.';
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const remoteConfigured = isSupabaseBrowserConfigured();
  const [state, setState] = useState<StudioState>(initialStudioState);
  const [persistence, setPersistence] = useState<StudioPersistenceMeta>({
    mode: 'local',
    configured: remoteConfigured,
    syncing: false,
    lastSyncedAt: null,
    error: '',
  });
  const hydratedRef = useRef(false);
  const skipNextRemotePersistRef = useRef(false);

  useEffect(() => {
    let bootstrapState = initialStudioState;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StudioState;
        bootstrapState = parsed;
        setState(parsed);
      }
    } catch {
      bootstrapState = initialStudioState;
      setState(initialStudioState);
    }

    const bootstrapRemoteState = async () => {
      if (!remoteConfigured) {
        hydratedRef.current = true;
        return;
      }

      setPersistence((current) => ({
        ...current,
        configured: true,
        syncing: true,
        error: '',
      }));

      try {
        const response = await fetch('/api/studio-state', {
          cache: 'no-store',
        });
        const payload = (await response.json().catch(() => null)) as {
          success?: boolean;
          data?: { state?: StudioState | null; updatedAt?: string | null };
          error?: string;
        } | null;

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error ?? 'No se pudo cargar el estado remoto.');
        }

        if (payload.data?.state) {
          skipNextRemotePersistRef.current = true;
          setState(payload.data.state);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.data.state));
        } else {
          const seedResponse = await fetch('/api/studio-state', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state: bootstrapState }),
          });
          const seedPayload = (await seedResponse.json().catch(() => null)) as {
            success?: boolean;
            data?: { updatedAt?: string | null };
            error?: string;
          } | null;

          if (!seedResponse.ok || !seedPayload?.success) {
            throw new Error(seedPayload?.error ?? 'No se pudo sembrar el estado remoto inicial.');
          }

          setPersistence({
            mode: 'remote',
            configured: true,
            syncing: false,
            lastSyncedAt: seedPayload.data?.updatedAt ?? new Date().toISOString(),
            error: '',
          });

          hydratedRef.current = true;
          return;
        }

        setPersistence({
          mode: 'remote',
          configured: true,
          syncing: false,
          lastSyncedAt: payload?.data?.updatedAt ?? null,
          error: '',
        });
      } catch (error: unknown) {
        setPersistence({
          mode: 'local',
          configured: true,
          syncing: false,
          lastSyncedAt: null,
          error: getErrorMessage(error),
        });
      } finally {
        hydratedRef.current = true;
      }
    };

    void bootstrapRemoteState();
  }, [remoteConfigured]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Keep the first version functional even if persistence is not available.
    }

    if (!hydratedRef.current || !remoteConfigured) {
      return;
    }

    if (skipNextRemotePersistRef.current) {
      skipNextRemotePersistRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        setPersistence((current) => ({
          ...current,
          syncing: true,
          error: '',
        }));

        try {
          const response = await fetch('/api/studio-state', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state }),
          });
          const payload = (await response.json().catch(() => null)) as {
            success?: boolean;
            data?: { updatedAt?: string | null };
            error?: string;
          } | null;

          if (!response.ok || !payload?.success) {
            throw new Error(payload?.error ?? 'No se pudo guardar el estado remoto.');
          }

          setPersistence({
            mode: 'remote',
            configured: true,
            syncing: false,
            lastSyncedAt: payload.data?.updatedAt ?? new Date().toISOString(),
            error: '',
          });
        } catch (error: unknown) {
          setPersistence((current) => ({
            ...current,
            mode: 'local',
            configured: true,
            syncing: false,
            error: getErrorMessage(error),
          }));
        }
      })();
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [state]);

  return (
    <StudioContext.Provider value={{ state, setState, persistence }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within StudioProvider');
  }
  return context;
}
