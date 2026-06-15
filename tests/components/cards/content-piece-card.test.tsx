import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentPiece } from '@/lib/studio-types';
import { ContentPieceCard } from '@/components/cards/content-piece-card';

const mockContentPiece: ContentPiece = {
  id: '1',
  title: 'Test Content',
  status: 'Listo',
  channel: 'blog',
  format: 'article',
  theme: 'Technology',
  emotion: 'Inspiring',
  cta: 'Read more',
  created_at: '2026-06-15',
  updated_at: '2026-06-15',
  user_id: 'user-1',
};

describe('ContentPieceCard', () => {
  it('renders content format and channel', () => {
    render(<ContentPieceCard piece={mockContentPiece} />);
    expect(screen.getByText('article')).toBeInTheDocument();
    expect(screen.getByText('blog')).toBeInTheDocument();
  });

  it('displays status', () => {
    render(<ContentPieceCard piece={mockContentPiece} />);
    expect(screen.getByText('Listo')).toBeInTheDocument();
  });
});
