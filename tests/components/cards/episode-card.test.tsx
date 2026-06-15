import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Episode } from '@/lib/studio-types';
import { EpisodeCard } from '@/components/cards/episode-card';

const mockEpisode: Episode = {
  id: '1',
  episodeNumber: '001',
  title: 'Test Episode',
  theme: 'Technology',
  pillar: 'Innovation',
  emotionalWound: 'Fear',
  centralSymbol: 'Light',
  objective: 'Educate',
  status: 'Publicado',
  narrativeStructure: [],
  script: 'Test script',
  spotifyDescription: 'Spotify description',
  appleDescription: 'Apple description',
  cta: 'Learn more',
  hooks: [],
  publishDate: '2026-06-15',
  notes: 'Test notes',
  nextAction: 'Distribute',
};

describe('EpisodeCard', () => {
  it('renders episode number and title', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('001')).toBeInTheDocument();
    expect(screen.getByText('Test Episode')).toBeInTheDocument();
  });

  it('displays status badge', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('Publicado')).toBeInTheDocument();
  });
});
