import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Episode } from '@/lib/studio-types';
import { EpisodeCard } from '../episode-card';

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
  it('renders episode title and number', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('001')).toBeInTheDocument();
    expect(screen.getByText('Test Episode')).toBeInTheDocument();
  });

  it('displays status badge', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('Publicado')).toBeInTheDocument();
  });

  it('shows theme and pillar', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Innovation')).toBeInTheDocument();
  });
});
