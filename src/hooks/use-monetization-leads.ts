'use client';

import { useCallback, useEffect, useState } from 'react';
import { MonetizationLead } from '@/lib/studio-types';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';

export interface MonetizationLeadFilters {
  status?: MonetizationLead['status'];
  page?: number;
  limit?: number;
}

export function useMonetizationLeads(filters?: MonetizationLeadFilters) {
  const [data, setData] = useState<MonetizationLead[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const authClient = getSupabaseAuthBrowserClient();
      if (!authClient) throw new Error('No auth client');

      let query = authClient
        .from('monetization_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.filter('payload', 'ilike', `%"status":"${filters.status}"%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data: rows, error: err } = await query;

      if (err) throw err;

      interface MonetizationLeadRow {
        id: string;
        created_at: string;
        updated_at: string;
        user_id: string | null;
        payload: Record<string, unknown>;
      }

      // Transform payload into MonetizationLead
      setData(
        (rows?.map((row: MonetizationLeadRow) => ({
          id: row.id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          user_id: row.user_id,
          ...(row.payload || {}),
        })) || []) as unknown as MonetizationLead[]
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
