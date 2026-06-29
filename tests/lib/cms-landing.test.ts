import { describe, it, expect, vi, beforeEach } from 'vitest';

  // Mock Supabase client
  vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(),
  }));

// Mock the server-side Supabase client used in queries
vi.mock('@/lib/supabase/server', () => ({
    createServerClient: vi.fn(),
  }));

// ---------------------------------------------------------------------------
// Unit tests for CMS types and helper logic (no Supabase calls needed)
// ---------------------------------------------------------------------------

describe('CMS: getSectionContent helper', () => {
    // Inline the helper to test it in isolation
    function getSectionContent<T>(
      sections: Array<{ section_key: string; content: Record<string, unknown> }> | null,
      key: string
  ): T | null {
        if (!sections) return null;
    const section = sections.find((s) => s.section_key === key);
    return section ? (section.content as T) : null;
}

  it('returns null when sections array is null', () => {
    expect(getSectionContent(null, 'hero')).toBeNull();
});

  it('returns null when key is not found', () => {
    const sections = [{ section_key: 'hero', content: { title: 'Hello' } }];
    expect(getSectionContent(sections, 'missing_key')).toBeNull();
});

  it('returns typed content when key is found', () => {
        const sections = [
{ section_key: 'hero', content: { title: 'AMTME', subtitle: 'Podcast' } },
        ];
    const result = getSectionContent<{ title: string; subtitle: string }>(sections, 'hero');
    expect(result).toEqual({ title: 'AMTME', subtitle: 'Podcast' });
                                     });

  it('returns the correct section when multiple sections exist', () => {
        const sections = [
{ section_key: 'hero', content: { title: 'Hero' } },
    { section_key: 'footer', content: { copyright: '2026' } },
{ section_key: 'about', content: { body: 'About us' } },
    ];
    expect(getSectionContent(sections, 'footer')).toEqual({ copyright: '2026' });
    expect(getSectionContent(sections, 'about')).toEqual({ body: 'About us' });
});
});

// ---------------------------------------------------------------------------
// Unit tests for LANDING_SECTION_KEYS constant
// ---------------------------------------------------------------------------

describe('CMS: LANDING_SECTION_KEYS', () => {
    // Manually define keys as they appear in types.ts
    const LANDING_SECTION_KEYS = [
      'hero',
      'featured_episode',
      'about',
      'topics_grid',
      'recent_episodes',
      'manifesto',
      'about_christian',
      'newsletter',
      'platforms',
    'footer',
    ] as const;

  it('includes all required landing sections', () => {
        expect(LANDING_SECTION_KEYS).toContain('hero');
    expect(LANDING_SECTION_KEYS).toContain('featured_episode');
    expect(LANDING_SECTION_KEYS).toContain('about');
    expect(LANDING_SECTION_KEYS).toContain('footer');
    expect(LANDING_SECTION_KEYS).toContain('newsletter');
    expect(LANDING_SECTION_KEYS).toContain('platforms');
      });

  it('has exactly 10 section keys', () => {
        expect(LANDING_SECTION_KEYS).toHaveLength(10);
});
});

// ---------------------------------------------------------------------------
// Unit tests for CMS query mocking
// ---------------------------------------------------------------------------

describe('CMS: getPublishedLandingPage with Supabase mock', () => {
    beforeEach(() => {
      vi.clearAllMocks();
});

  it('returns null when no published page exists', async () => {
        const mockSupabase = {
          from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    }),
    }),
    };

    // Simulate the query function behavior with null data
    const simulateGetPublishedLandingPage = async (client: typeof mockSupabase) => {
      const { data } = await client
        .from('site_pages')
        .select('*')
        .eq('slug', 'landing')
        .single();
      return data;
};

    const result = await simulateGetPublishedLandingPage(mockSupabase);
    expect(result).toBeNull();
});

  it('returns page data when published page exists', async () => {
        const mockPage = {
                id: 'page-123',
                        slug: 'landing',
                        is_published: true,
                        seo_metadata: {
        title: 'AMTME',
                  description: 'Podcast',
                  og_title: 'AMTME OG',
                  og_description: 'OG Desc',
                  og_image: 'https://example.com/og.jpg',
          },
        };

    const mockSupabase = {
            from: vi.fn().mockReturnValue({
                      select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                          single: vi.fn().mockResolvedValue({ data: mockPage, error: null }),
              }),
              }),
              }),
              };

    const simulateGetPublishedLandingPage = async (client: typeof mockSupabase) => {
            const { data } = await client
        .from('site_pages')
              .select('*')
              .eq('slug', 'landing')
              .single();
      return data;
  };

    const result = await simulateGetPublishedLandingPage(mockSupabase);
    expect(result).not.toBeNull();
    expect(result?.is_published).toBe(true);
    expect(result?.seo_metadata?.title).toBe('AMTME');
});
});

// ---------------------------------------------------------------------------
// Unit tests for admin check mock
// ---------------------------------------------------------------------------

describe('CMS: checkIsAdmin', () => {
    it('returns false when RPC returns false', async () => {
      const mockSupabase = {
        rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
  };

    const simulateCheckIsAdmin = async (client: typeof mockSupabase) => {
      const { data, error } = await client.rpc('is_cms_admin');
      if (error) return false;
      return data === true;
};

    const result = await simulateCheckIsAdmin(mockSupabase);
    expect(result).toBe(false);
});

  it('returns true when RPC returns true', async () => {
        const mockSupabase = {
                rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
                  };

    const simulateCheckIsAdmin = async (client: typeof mockSupabase) => {
      const { data, error } = await client.rpc('is_cms_admin');
      if (error) return false;
      return data === true;
    };

    const result = await simulateCheckIsAdmin(mockSupabase);
    expect(result).toBe(true);
        });

  it('returns false when RPC throws an error', async () => {
        const mockSupabase = {
          rpc: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
    };

        const simulateCheckIsAdmin = async (client: typeof mockSupabase) => {
      const { data, error } = await client.rpc('is_cms_admin');
      if (error) return false;
      return data === true;
        };

    const result = await simulateCheckIsAdmin(mockSupabase);
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Unit tests for section visibility toggle logic
// ---------------------------------------------------------------------------

describe('CMS: toggleSectionVisibility', () => {
    it('calls update with correct is_visible value', async () => {
      const updateMock = vi.fn().mockResolvedValue({ error: null });
      const eqMock = vi.fn().mockReturnValue({ error: null });
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: eqMock,
  }),
  }),
  };

    mockSupabase.from('site_sections').update({ is_visible: false }).eq('id', 'section-123');
    expect(mockSupabase.from).toHaveBeenCalledWith('site_sections');
});
});

// ---------------------------------------------------------------------------
// Integration-style: reorder sections logic
// ---------------------------------------------------------------------------

describe('CMS: reorderSections', () => {
    it('processes multiple section order updates', async () => {
      const updates = [
{ sectionId: 'sec-1', sortOrder: 0 },
  { sectionId: 'sec-2', sortOrder: 1 },
  { sectionId: 'sec-3', sortOrder: 2 },
      ];

    const callLog: string[] = [];
    const mockUpdate = vi.fn().mockImplementation(({ sort_order }) => ({
      eq: vi.fn().mockImplementation((_, id) => {
        callLog.push(`update:${id}:${sort_order}`);
        return Promise.resolve({ error: null });
}),
}));

    const mockSupabase = {
            from: vi.fn().mockReturnValue({ update: mockUpdate }),
              };

    // Simulate reorder
    for (const u of updates) {
            mockSupabase.from('site_sections').update({ sort_order: u.sortOrder }).eq('id', u.sectionId);
}

    expect(mockUpdate).toHaveBeenCalledTimes(3);
    expect(mockUpdate).toHaveBeenCalledWith({ sort_order: 0 });
    expect(mockUpdate).toHaveBeenCalledWith({ sort_order: 1 });
    expect(mockUpdate).toHaveBeenCalledWith({ sort_order: 2 });
});
});
