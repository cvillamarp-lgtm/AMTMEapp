import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadStudioStateFromRemote, saveStudioStateToRemote } from '@/lib/studio-persistence';
import * as supabaseServer from '@/lib/supabase/server';
import * as supabaseEnv from '@/lib/supabase/env';
import type { StudioState } from '@/lib/studio-types';

vi.mock('@/lib/supabase/server');
vi.mock('@/lib/supabase/env');

describe('studio-persistence', () => {
  const mockUserId = 'user-123-uuid';
  const mockState: StudioState = {
    masterSections: [],
    episodes: [],
    visualAssets: [],
    contentPieces: [],
    metricsMonthly: [],
    metricsEpisode: [],
    checklists: [],
    calendarEvents: [],
    archiveItems: [],
    monetizationLeads: [],
    automationRules: [],
    aiHistory: [],
    config: {
      projectName: 'Test Project',
      projectDescriptor: 'Test',
      uiLanguage: 'es',
      timeZone: 'UTC',
      currency: 'USD',
      operationalContext: 'test',
      paletteLocked: false,
      activeChannels: [],
      activeFormats: [],
      defaultChannel: 'youtube',
      defaultFrequency: 'weekly',
      publishingWindows: [],
      frequentCtas: [],
      defaultNarrativeStructure: [],
      editorialTone: 'neutral',
      psychologicalConcepts: [],
      futureApis: [],
      futureIntegrations: [],
      aiPrimaryProvider: 'groq',
      aiFallbackProvider: 'claude',
      aiEnabled: true,
      aiPreferredModelByProvider: {
        groq: 'llama-3.1-8b-instant',
        claude: 'claude-3-sonnet',
        gemini: 'gemini-2.0-flash',
        grok: 'grok-2',
      },
      aiVisibleModelsByProvider: {
        groq: ['llama-3.1-8b-instant'],
        claude: ['claude-3-sonnet'],
        gemini: ['gemini-2.0-flash'],
        grok: ['grok-2'],
      },
      aiSystemPrompt: '',
      aiTone: 'neutral',
      aiImageModel: 'dall-e-3',
      aiNarrativeStructure: [],
      aiQualityRules: [],
      aiBaseQualityChecklist: [],
      aiConnectionStatus: 'connected',
      persistenceMode: 'local',
      environmentReadOnlyFlags: [],
      uiDensity: 'estandar',
      compactCards: false,
      showInterfaceHelp: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadStudioStateFromRemote', () => {
    it('should filter by user_id (not owner_id)', async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const mockSecondEq = vi.fn().mockReturnValueOnce({
        maybeSingle: mockMaybeSingle,
      });

      const mockFirstEq = vi.fn().mockReturnValueOnce({
        eq: mockSecondEq,
      });

      const mockSelect = vi.fn().mockReturnValueOnce({
        eq: mockFirstEq,
      });

      const mockClient = {
        from: vi.fn().mockReturnValueOnce({
          select: mockSelect,
        }),
      };

      vi.mocked(supabaseServer.getSupabaseServiceRoleClient).mockReturnValue(mockClient as any);
      vi.mocked(supabaseEnv.getStudioStateKey).mockReturnValue('primary');

      await loadStudioStateFromRemote(mockUserId);

      expect(mockSelect).toHaveBeenCalledWith('payload, updated_at');
      // First eq call should be for user_id, NOT owner_id
      expect(mockFirstEq).toHaveBeenCalledWith('user_id', mockUserId);
      // Second eq call should be for key
      expect(mockSecondEq).toHaveBeenCalledWith('key', 'primary');
    });
  });

  describe('saveStudioStateToRemote', () => {
    it('should use user_id in upsert (not owner_id)', async () => {
      const mockSingle = vi.fn().mockResolvedValueOnce({
        data: { updated_at: '2026-06-18T00:00:00Z' },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValueOnce({
        single: mockSingle,
      });

      const mockUpsert = vi.fn().mockReturnValueOnce({
        select: mockSelect,
      });

      const mockClient = {
        from: vi.fn().mockReturnValueOnce({
          upsert: mockUpsert,
        }),
      };

      vi.mocked(supabaseServer.getSupabaseServiceRoleClient).mockReturnValue(mockClient as any);
      vi.mocked(supabaseEnv.getStudioStateKey).mockReturnValue('primary');

      await saveStudioStateToRemote(mockUserId, mockState);

      expect(mockUpsert).toHaveBeenCalled();
      const upsertData = mockUpsert.mock.calls[0][0];
      expect(upsertData.user_id).toBe(mockUserId);
      expect(upsertData.owner_id).toBeUndefined();

      // Check onConflict uses user_id, not owner_id
      const onConflict = mockUpsert.mock.calls[0][1];
      expect(onConflict.onConflict).toBe('user_id,key');
    });
  });
});
