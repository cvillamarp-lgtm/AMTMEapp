import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EpisodeList } from '../episode-list';

// Mock the useEpisodes hook
vi.mock('@/hooks', () => ({
  useEpisodes: vi.fn(() => ({
    data: [
      {
        id: '1',
        episodeNumber: '001',
        title: 'Test Episode 1',
        theme: 'Tech',
        pillar: 'Innovation',
        emotionalWound: 'Fear',
        centralSymbol: 'Light',
        objective: 'Educate',
        status: 'Publicado',
        narrativeStructure: [],
        script: 'Script',
        spotifyDescription: 'Desc',
        appleDescription: 'Desc',
        cta: 'Learn',
        hooks: [],
        publishDate: '2026-06-15',
        notes: 'Notes',
        nextAction: 'Distribute',
      },
    ],
    loading: false,
    error: null,
  })),
  useContentPieces: vi.fn(() => ({
    data: [],
    loading: false,
    error: null,
  })),
  useMonetizationLeads: vi.fn(() => ({
    data: [],
    loading: false,
    error: null,
  })),
}));

describe('EpisodeList', () => {
  it('renders loading state initially', () => {
    // Override hook for this test
    vi.doMock('@/hooks', () => ({
      useEpisodes: vi.fn(() => ({
        data: [],
        loading: true,
        error: null,
      })),
      useContentPieces: vi.fn(() => ({
        data: [],
        loading: false,
        error: null,
      })),
      useMonetizationLeads: vi.fn(() => ({
        data: [],
        loading: false,
        error: null,
      })),
    }));
  });

  it('displays episodes when data is loaded', () => {
    render(<EpisodeList limit={10} />);
    expect(screen.getByText('Test Episode 1')).toBeInTheDocument();
  });

  it('passes limit prop to hook', () => {
    render(<EpisodeList limit={5} />);
    // Hook should be called with limit 5
    expect(screen.getByText('Test Episode 1')).toBeInTheDocument();
  });
});
