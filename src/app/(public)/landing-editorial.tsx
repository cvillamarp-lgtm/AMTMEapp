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
import { getPublishedLandingPage } from '@/lib/cms/queries';
import type {
    HeroContent,
    FeaturedEpisodeContent,
    AboutContent,
    ManifestoContent,
    AboutChristianContent,
    NewsletterContent,
    PlatformsContent,
    FooterContent,
} from '@/lib/cms/types';

function getSectionContent<T>(
    sections: Array<{ section_key: string; content: Record<string, unknown> }> | null,
    key: string
  ): T | null {
    if (!sections) return null;
    const section = sections.find((s) => s.section_key === key);
    return section ? (section.content as T) : null;
}

export async function LandingEditorial() {
    let cmsData: {
          sections: Array<{ section_key: string; content: Record<string, unknown> }>;
    } | null = null;

  try {
        const result = await getPublishedLandingPage();
        if (result?.sections && result.sections.length > 0) {
                cmsData = { sections: result.sections };
        }
  } catch {
        // Fallback to hardcoded content if CMS is unavailable
      cmsData = null;
  }

  const heroContent = getSectionContent<HeroContent>(cmsData?.sections ?? null, 'hero');
    const featuredEpisodeContent = getSectionContent<FeaturedEpisodeContent>(
          cmsData?.sections ?? null,
          'featured_episode'
        );
    const aboutContent = getSectionContent<AboutContent>(cmsData?.sections ?? null, 'about');
    const manifestoContent = getSectionContent<ManifestoContent>(
          cmsData?.sections ?? null,
          'manifesto'
        );
    const aboutChristianContent = getSectionContent<AboutChristianContent>(
          cmsData?.sections ?? null,
          'about_christian'
        );
    const newsletterContent = getSectionContent<NewsletterContent>(
          cmsData?.sections ?? null,
          'newsletter'
        );
    const platformsContent = getSectionContent<PlatformsContent>(
          cmsData?.sections ?? null,
          'platforms'
        );
    const footerContent = getSectionContent<FooterContent>(cmsData?.sections ?? null, 'footer');

  return (
        <div className="min-h-screen" style={{ backgroundColor: '#f5f2ea', color: '#0c1f36' }}>
                <EditorialHeader />

                <main>
                        <EditorialHero cmsContent={heroContent} />
                        <EditorialFeaturedEpisode cmsContent={featuredEpisodeContent} />
                        <EditorialAboutSection cmsContent={aboutContent} />
                        <EditorialTopicsGrid />
                        <EditorialRecentEpisodes />
                        <EditorialManifesto cmsContent={manifestoContent} />
                        <EditorialAboutChristian cmsContent={aboutChristianContent} />
                        <EditorialNewsletter cmsContent={newsletterContent} />
                        <EditorialPlatforms cmsContent={platformsContent} />
                </main>main>
        
              <EditorialFooter cmsContent={footerContent} />
        </div>div>
      );
}</main>
