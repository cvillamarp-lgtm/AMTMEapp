'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';
import {
  EpisodeWorkspace,
  EpisodeChecklistItem,
  initializeWorkspaceState,
  EpisodeWorkspaceStateSchema,
} from '@/lib/studio-context';

interface EpisodePageProps {
  params: Promise<{
    episodeId: string;
  }>;
}

export default function EpisodePage({ params }: EpisodePageProps) {
  const router = useRouter();
  const [episodeId, setEpisodeId] = useState<string>('');
  const [workspace, setWorkspace] = useState<EpisodeWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Resolve params
  useMemo(() => {
    params
      .then((p) => setEpisodeId(p.episodeId))
      .catch(() => {
        setError('Failed to resolve episode ID');
        setIsLoading(false);
      });
  }, [params]);

  // Get current authenticated user (SECURITY)
  useEffect(() => {
    const getAuthUser = async () => {
      const authClient = getSupabaseAuthBrowserClient();
      if (!authClient) {
        setError('Authentication client unavailable');
        setIsLoading(false);
        return;
      }

      const {
        data: { user },
      } = await authClient.auth.getUser();
      if (!user) {
        // Should be caught by middleware, but as defense in depth:
        router.push('/auth/sign-in');
        return;
      }
      setUserId(user.id);
    };

    getAuthUser();
  }, [router]);

  // Validate episode ownership before initializing workspace
  useEffect(() => {
    if (!episodeId || !userId) return;

    const validateAndInitialize = async () => {
      try {
        const authClient = getSupabaseAuthBrowserClient();
        if (!authClient) throw new Error('Auth client unavailable');

        // SECURITY: Verify episode exists and belongs to current user
        const { data: episodeExists, error: queryError } = await authClient
          .from('episodes')
          .select('id, user_id')
          .eq('id', episodeId)
          .eq('user_id', userId)
          .single();

        if (queryError || !episodeExists) {
          // Return 404-like error without revealing if episode exists
          setError('Episode not found or access denied');
          setIsLoading(false);
          return;
        }

        // Episode ownership validated, initialize workspace
        const state = initializeWorkspaceState(episodeId);
        const newWorkspace: EpisodeWorkspace = {
          id: `workspace-${episodeId}`,
          episodeId,
          ownerId: userId,
          state,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          schemaVersion: 1,
        };
        EpisodeWorkspaceStateSchema.parse(newWorkspace.state);
        setWorkspace(newWorkspace);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize workspace');
      } finally {
        setIsLoading(false);
      }
    };

    validateAndInitialize();
  }, [episodeId, userId]);

  const handleChecklistItemToggle = useCallback(
    (itemId: string) => {
      if (!workspace?.state.checklist) return;

      setWorkspace((prev) => {
        if (!prev?.state.checklist) return prev;
        return {
          ...prev,
          state: {
            ...prev.state,
            checklist: {
              ...prev.state.checklist,
              items: prev.state.checklist.items.map((item: EpisodeChecklistItem) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            },
            lastModifiedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [workspace]
  );

  const handleStatusChange = useCallback((newStatus: string) => {
    setWorkspace((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        state: {
          ...prev.state,
          status: newStatus as 'draft' | 'in_progress' | 'review' | 'published',
          lastModifiedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const checklistCompletionPercentage = useMemo(() => {
    if (!workspace?.state.checklist?.items.length) return 0;
    const completed = workspace.state.checklist.items.filter(
      (item: EpisodeChecklistItem) => item.completed
    ).length;
    return Math.round((completed / workspace.state.checklist.items.length) * 100);
  }, [workspace?.state.checklist]);

  if (isLoading) {
    return <div className="p-8">Loading workspace...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (!workspace) {
    return <div className="p-8 text-gray-600">Workspace not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Episode Workspace</h1>
          <p className="text-gray-600">Episode: {episodeId}</p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="flex gap-2">
            {(['draft', 'in_progress', 'review', 'published'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  workspace.state.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Last modified: {workspace.state.lastModifiedAt || workspace.updatedAt}
          </p>
        </section>

        {workspace.state.checklist && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{workspace.state.checklist.title}</h2>
            <div className="mb-4 bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-900">Completion: {checklistCompletionPercentage}%</p>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${checklistCompletionPercentage}%` }}
                />
              </div>
            </div>
            <ul className="space-y-2">
              {workspace.state.checklist.items.map((item: EpisodeChecklistItem) => (
                <li key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistItemToggle(item.id)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      item.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
