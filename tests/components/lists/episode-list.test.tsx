import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Episode } from '@/lib/studio-types';
import { EpisodeList } from '@/components/lists/episode-list';
import { vi } from 'vitest';

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
      } as Episode,
    ],
    loading: false,
    error: null,
  })),
}));

describe('EpisodeList', () => {
  it('renders episodes from hook', () => {
    render(<EpisodeList limit={10} />);
    expect(screen.getByText('Test Episode 1')).toBeInTheDocument();
  });
});
