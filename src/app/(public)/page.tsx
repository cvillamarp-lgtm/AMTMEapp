import { LandingEditorial } from './landing-editorial';
import { getPublishedLandingPage } from '@/lib/landing-cms/queries';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch CMS data for SEO
  const { page } = await getPublishedLandingPage('home');

  return {
    title:
      page?.title || 'AMITAMPOCOMEEXPLICARON — Podcast de Claridad Emocional · Christian Tebaldi',
    description:
      page?.description || 'Un podcast sobre claridad emocional, relaciones y autoconocimiento.',
    keywords: page?.meta_keywords || 'podcast, emocional, claridad, relaciones',
    openGraph: {
      title: page?.title || 'AMITAMPOCOMEEXPLICARON',
      description: page?.description || 'Podcast de claridad emocional',
      images: page?.og_image_url ? [{ url: page.og_image_url }] : [],
    },
  };
}

export default function HomePage() {
  return <LandingEditorial />;
}
