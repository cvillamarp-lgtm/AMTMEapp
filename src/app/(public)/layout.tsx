import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'A Mí Tampoco Me Explicaron — Pódcast sobre amor, apego e identidad',
    template: '%s | AMTME',
  },
  description:
    'Conversaciones reales sobre amor, apego e identidad para quienes quieren entenderse de verdad. 34+ episodios. Escucha en Spotify. Por Christian Villamar.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'A Mí Tampoco Me Explicaron',
    description:
      'Conversaciones sobre amor, apego e identidad para quienes quieren entenderse de verdad.',
    url: 'https://www.amitampocomeexplicaron.com',
    siteName: 'A Mí Tampoco Me Explicaron',
    locale: 'es_MX',
    type: 'website',
    images: [
      {
        url: 'https://www.amitampocomeexplicaron.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'A Mí Tampoco Me Explicaron — Pódcast AMTME',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@yosoyvillamar',
  },
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  const podcastSchema = {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: 'A Mí Tampoco Me Explicaron',
    description:
      'Conversaciones reales sobre amor, apego e identidad para quienes quieren entenderse de verdad.',
    url: 'https://www.amitampocomeexplicaron.com',
    author: {
      '@type': 'Person',
      name: 'Christian Villamar',
      sameAs: [
        'https://instagram.com/yosoyvillamar',
        'https://instagram.com/amitampocomeexplicaron',
      ],
    },
    inLanguage: 'es-MX',
    genre: ['Relationships', 'Self-knowledge', 'Mental Health'],
    numberOfEpisodes: 34,
    image: 'https://www.amitampocomeexplicaron.com/og-image.png',
  };

  return (
    <>
      <Script
        id="podcast-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSchema) }}
      />
      {children}
    </>
  );
}
