import { EditorialHeader } from '@/components/editorial/EditorialHeader';
import { getPublishedLandingPage } from '@/lib/cms/queries';
import { LANDING_FALLBACK_SECTIONS } from '@/lib/cms/fallback';
import {
  WrappedEditorialHero,
  WrappedEditorialFeaturedEpisode,
  WrappedEditorialAboutSection,
  WrappedEditorialTopicsGrid,
  WrappedEditorialRecentEpisodes,
  WrappedEditorialManifesto,
  WrappedEditorialAboutChristian,
  WrappedEditorialNewsletter,
  WrappedEditorialPlatforms,
  WrappedEditorialFooter,
} from '@/components/cms/editorial-wrappers';
import {
  getHeroProps,
  getFeaturedEpisodeProps,
  getAboutProps,
  getTopicsProps,
  getRecentEpisodesProps,
  getManifestoProps,
  getAboutChristianProps,
  getNewsletterProps,
  getPlatformsProps,
  getFooterProps,
} from '@/components/cms/adapters';

export async function LandingEditorial() {
  // Load CMS data (or empty if Supabase unavailable)
  const { sections } = await getPublishedLandingPage();

  // Get sections in order (visible only)
  const visibleSections = sections
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Build fallback sections map
  const fallbackSectionMap = new Map(LANDING_FALLBACK_SECTIONS.map((s) => [s.section_key, s]));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f2ea', color: '#0c1f36' }}>
      <EditorialHeader />

      <main>
        {visibleSections.length > 0 ? (
          visibleSections.map((section) => {
            const fallbackSection = fallbackSectionMap.get(section.section_key);

            switch (section.section_key) {
              case 'hero':
                return (
                  <WrappedEditorialHero
                    key="hero"
                    cmsData={getHeroProps(section)}
                    fallbackData={getHeroProps(fallbackSection || null)}
                  />
                );
              case 'featured_episode':
                return (
                  <WrappedEditorialFeaturedEpisode
                    key="featured_episode"
                    cmsData={getFeaturedEpisodeProps(section)}
                    fallbackData={getFeaturedEpisodeProps(fallbackSection || null)}
                  />
                );
              case 'about':
                return (
                  <WrappedEditorialAboutSection
                    key="about"
                    cmsData={getAboutProps(section)}
                    fallbackData={getAboutProps(fallbackSection || null)}
                  />
                );
              case 'topics':
                return (
                  <WrappedEditorialTopicsGrid
                    key="topics"
                    cmsData={getTopicsProps(section)}
                    fallbackData={getTopicsProps(fallbackSection || null)}
                  />
                );
              case 'recent_episodes':
                return (
                  <WrappedEditorialRecentEpisodes
                    key="recent_episodes"
                    cmsData={getRecentEpisodesProps(section)}
                    fallbackData={getRecentEpisodesProps(fallbackSection || null)}
                  />
                );
              case 'manifesto':
                return (
                  <WrappedEditorialManifesto
                    key="manifesto"
                    cmsData={getManifestoProps(section)}
                    fallbackData={getManifestoProps(fallbackSection || null)}
                  />
                );
              case 'about_christian':
                return (
                  <WrappedEditorialAboutChristian
                    key="about_christian"
                    cmsData={getAboutChristianProps(section)}
                    fallbackData={getAboutChristianProps(fallbackSection || null)}
                  />
                );
              case 'newsletter':
                return (
                  <WrappedEditorialNewsletter
                    key="newsletter"
                    cmsData={getNewsletterProps(section)}
                    fallbackData={getNewsletterProps(fallbackSection || null)}
                  />
                );
              case 'platforms':
                return (
                  <WrappedEditorialPlatforms
                    key="platforms"
                    cmsData={getPlatformsProps(section)}
                    fallbackData={getPlatformsProps(fallbackSection || null)}
                  />
                );
              case 'footer':
                return (
                  <WrappedEditorialFooter
                    key="footer"
                    cmsData={getFooterProps(section)}
                    fallbackData={getFooterProps(fallbackSection || null)}
                  />
                );
              default:
                return null;
            }
          })
        ) : (
          // Fallback: render all sections with hardcoded data if CMS is empty
          <>
            <WrappedEditorialHero
              fallbackData={getHeroProps(fallbackSectionMap.get('hero') || null)}
            />
            <WrappedEditorialFeaturedEpisode
              fallbackData={getFeaturedEpisodeProps(
                fallbackSectionMap.get('featured_episode') || null
              )}
            />
            <WrappedEditorialAboutSection
              fallbackData={getAboutProps(fallbackSectionMap.get('about') || null)}
            />
            <WrappedEditorialTopicsGrid
              fallbackData={getTopicsProps(fallbackSectionMap.get('topics') || null)}
            />
            <WrappedEditorialRecentEpisodes
              fallbackData={getRecentEpisodesProps(
                fallbackSectionMap.get('recent_episodes') || null
              )}
            />
            <WrappedEditorialManifesto
              fallbackData={getManifestoProps(fallbackSectionMap.get('manifesto') || null)}
            />
            <WrappedEditorialAboutChristian
              fallbackData={getAboutChristianProps(
                fallbackSectionMap.get('about_christian') || null
              )}
            />
            <WrappedEditorialNewsletter
              fallbackData={getNewsletterProps(fallbackSectionMap.get('newsletter') || null)}
            />
            <WrappedEditorialPlatforms
              fallbackData={getPlatformsProps(fallbackSectionMap.get('platforms') || null)}
            />
            <WrappedEditorialFooter
              fallbackData={getFooterProps(fallbackSectionMap.get('footer') || null)}
            />
          </>
        )}
      </main>
    </div>
  );
}
