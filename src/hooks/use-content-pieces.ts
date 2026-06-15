'use client';

import { useCallback, useEffect, useState } from 'react';
import { ContentPiece } from '@/lib/studio-types';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';

export interface ContentPieceFilters {
  status?: ContentPiece['status'];
  channel?: string;
  page?: number;
  limit?: number;
}

export function useContentPieces(filters?: ContentPieceFilters) {
  const [data, setData] = useState<ContentPiece[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const authClient = getSupabaseAuthBrowserClient();
      if (!authClient) throw new Error('No auth client');

      let query = authClient
        .from('content_pieces')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.filter('payload', 'ilike', `%"status":"${filters.status}"%`);
      }

      if (filters?.channel) {
        query = query.filter('payload', 'ilike', `%"channel":"${filters.channel}"%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data: rows, error: err } = await query;

      if (err) throw err;

      // Transform payload into ContentPiece
      setData(
        rows?.map((row: any) => ({
          id: row.id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          user_id: row.user_id,
          ...(row.payload || {}),
        })) || []
      );
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.channel, filters?.limit]);

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
