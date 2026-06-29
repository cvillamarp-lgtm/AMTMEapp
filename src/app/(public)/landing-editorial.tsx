import { EditorialHeader } from '@/components/editorial/EditorialHeader';
import { EditorialHero } from '@/components/editorial/EditorialHero';
import { EditorialFeaturedEpisode } from '@/components/editorial/EditorialFeaturedEpisode';
import { EditorialAboutSection } from '@/components/editorial/EditorialAboutSection';
import { EditorialTopicsGrid } from '@/components/editorial/EditorialTopicsGrid';
import { EditorialRecentEpisodes } from '@/components/editorial/EditorialRecentEpisodes';
import { EditorialManifesto } from '@/components/editorial/EditorialManifesto';
import { EditorialAboutChristian } from '@/components/editorial/EditorialAboutChristian';
import { EditorialNewsletter } from '@/components/editorial/EditorialNewsletter';
import { EditorialPlatforms } from '@/components/editorial/EditorialPlatforms';
import { EditorialFooter } from '@/components/editorial/EditorialFooter';

export async function LandingEditorial() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f2ea', color: '#0c1f36' }}>
      <EditorialHeader />

      <main>
        <EditorialHero />
        <EditorialFeaturedEpisode />
        <EditorialAboutSection />
        <EditorialTopicsGrid />
        <EditorialRecentEpisodes />
        <EditorialManifesto />
        <EditorialAboutChristian />
        <EditorialNewsletter />
        <EditorialPlatforms />
      </main>

      <EditorialFooter />
    </div>
  );
}
