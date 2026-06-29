import { LandingEditorial } from './landing-editorial';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AMTME — A Mí Tampoco Me Explicaron · Podcast de Christian Villamar',
  description:
    'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo. Conducido por Christian Villamar.',
};

export default function HomePage() {
  return <LandingEditorial />;
}
