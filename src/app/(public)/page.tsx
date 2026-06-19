import { Header } from '@/components/amtme/Header';
import { Hero } from '@/components/amtme/Hero';
import { FeaturedEpisode } from '@/components/amtme/FeaturedEpisode';
import { AboutPodcast } from '@/components/amtme/AboutPodcast';
import { TopicsGrid } from '@/components/amtme/TopicsGrid';
import { RecentEpisodes } from '@/components/amtme/RecentEpisodes';
import { ContactCTA } from '@/components/amtme/ContactCTA';
import { AboutHost } from '@/components/amtme/AboutHost';
import { Newsletter } from '@/components/amtme/Newsletter';
import { PlatformLinks } from '@/components/amtme/PlatformLinks';
import { Footer } from '@/components/amtme/Footer';

export const metadata = {
  title: 'A Mí Tampoco Me Explicaron — Podcast de Christian Villamar',
  description:
    'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo. Conducido por Christian Villamar.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-cream text-navy">
      <Header />
      <main>
        <Hero />
        <FeaturedEpisode />
        <AboutPodcast />
        <TopicsGrid />
        <RecentEpisodes />
        <ContactCTA />
        <AboutHost />
        <Newsletter />
        <PlatformLinks />
      </main>
      <Footer />
    </div>
  );
}
