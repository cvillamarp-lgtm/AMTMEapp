import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonetizationLead } from '@/lib/studio-types';
import { MonetizationLeadCard } from '@/components/cards/monetization-lead-card';

const mockLead: MonetizationLead = {
  id: '1',
  name: 'Test Lead',
  source: 'email',
  status: 'Nuevo lead',
  offerId: 'offer-1',
  revenue: 0,
  created_at: '2026-06-15',
  updated_at: '2026-06-15',
  user_id: 'user-1',
};

describe('MonetizationLeadCard', () => {
  it('renders lead name', () => {
    render(<MonetizationLeadCard lead={mockLead} />);
    expect(screen.getByText('Test Lead')).toBeInTheDocument();
  });

  it('displays status', () => {
    render(<MonetizationLeadCard lead={mockLead} />);
    expect(screen.getByText('Nuevo lead')).toBeInTheDocument();
  });
});
