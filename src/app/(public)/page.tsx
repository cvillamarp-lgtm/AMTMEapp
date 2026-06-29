import { LandingEditorial } from './landing-editorial';
import type { Metadata } from 'next';
import { getPublishedLandingPage } from '@/lib/cms/queries';
import type { SeoMetadata } from '@/lib/cms/types';

const FALLBACK_METADATA: Metadata = {
    title: 'AMTME — A Mi Tampoco Me Explicaron · Podcast de Christian Villamar',
    description:
          'Podcast emocional sobre amor, apego, vinculos, limites y volver a uno mismo. Conducido por Christian Villamar.',
    openGraph: {
          title: 'AMTME — A Mi Tampoco Me Explicaron',
          description: 'Podcast emocional sobre amor, apego, vinculos, limites y volver a uno mismo.',
          url: 'https://www.amitampocomeexplicaron.com',
          siteName: 'A Mi Tampoco Me Explicaron',
          images: [
            {
                      url: 'https://www.amitampocomeexplicaron.com/og-image.jpg',
                      width: 1200,
                      height: 630,
                      alt: 'AMTME Podcast',
            },
                ],
          locale: 'es_ES',
          type: 'website',
    },
    twitter: {
          card: 'summary_large_image',
          title: 'AMTME — A Mi Tampoco Me Explicaron',
          description: 'Podcast emocional sobre amor, apego, vinculos, limites y volver a uno mismo.',
          images: ['https://www.amitampocomeexplicaron.com/og-image.jpg'],
    },
};

export async function generateMetadata(): Promise<Metadata> {
    try {
          const result = await getPublishedLandingPage();
          const seo = result?.page?.seo_metadata as SeoMetadata | undefined;
          if (!seo) return FALLBACK_METADATA;
          return {
                  title: seo.title || FALLBACK_METADATA.title,
                  description: seo.description || (FALLBACK_METADATA.description as string),
                  openGraph: {
                            title: seo.og_title || (FALLBACK_METADATA.openGraph?.title as string),
                            description: seo.og_description || (FALLBACK_METADATA.openGraph?.description as string),
                            url: 'https://www.amitampocomeexplicaron.com',
                            siteName: 'A Mi Tampoco Me Explicaron',
                            images: seo.og_image
                              ? [{ url: seo.og_image, width: 1200, height: 630, alt: 'AMTME Podcast' }]
                                        : FALLBACK_METADATA.openGraph?.images,
                            locale: 'es_ES',
                            type: 'website',
                  },
                  twitter: {
                            card: 'summary_large_image',
                            title: seo.og_title || (FALLBACK_METADATA.twitter?.title as string),
                            description: seo.og_description || (FALLBACK_METADATA.twitter?.description as string),
                            images: seo.og_image
                              ? [seo.og_image]
                                        : (FALLBACK_METADATA.twitter?.images as string[]),
                  },
          };
    } catch {
          return FALLBACK_METADATA;
    }
}

export default function HomePage() {
    return <LandingEditorial />;
}
