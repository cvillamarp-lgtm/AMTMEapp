import { LandingEditorial } from './landing-editorial';
import { getPublishedLandingPage } from '@/lib/cms/queries';
import { getLandingPageWithFallback } from '@/lib/cms/fallback';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getPublishedLandingPage();
  const fallbackPage = getLandingPageWithFallback(page);

  const seo = fallbackPage.payload?.seo as Record<string, unknown> | undefined;
  const title =
    (seo?.title as string) || 'AMTME — A Mí Tampoco Me Explicaron · Podcast de Christian Villamar';
  const description =
    (seo?.description as string) ||
    'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo. Conducido por Christian Villamar.';

  return {
    title,
    description,
    openGraph: {
      title: (seo?.ogTitle as string) || title,
      description: (seo?.ogDescription as string) || description,
      images: seo?.ogImage ? [{ url: seo.ogImage as string }] : [],
    },
  };
}

export default function HomePage() {
  return <LandingEditorial />;
}
