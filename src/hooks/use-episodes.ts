'use client';

import { useCallback, useEffect, useState } from 'react';
import { Episode } from '@/lib/studio-types';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';

export interface EpisodeFilters {
  status?: Episode['status'];
  page?: number;
  limit?: number;
}

export function useEpisodes(filters?: EpisodeFilters) {
  const [data, setData] = useState<Episode[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const authClient = getSupabaseAuthBrowserClient();
      if (!authClient) throw new Error('No auth client');

      // Get current user to validate ownership
      const {
        data: { user },
      } = await authClient.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // SECURITY: Filter episodes by current user_id to prevent IDOR
      let query = authClient
        .from('episodes')
        .select('*')
        .eq('user_id', user.id) // Only fetch episodes owned by current user
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.filter('payload', 'ilike', `%"status":"${filters.status}"%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data: rows, error: err } = await query;

      if (err) throw err;

      interface EpisodeRow {
        id: string;
        created_at: string;
        updated_at: string;
        user_id: string | null;
        payload: Record<string, unknown>;
      }

      // Transform payload into Episode
      setData(
        (rows?.map((row: EpisodeRow) => ({
          id: row.id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          user_id: row.user_id,
          ...(row.payload || {}),
        })) || []) as unknown as Episode[]
      );
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    error,
    loading,
    refetch: fetch,
  };
}
