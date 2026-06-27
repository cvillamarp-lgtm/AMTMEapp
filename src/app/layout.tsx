import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Archivo_Black } from 'next/font/google';
import { RemoveLovableBadge } from '@/components/remove-lovable-badge';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-black',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AMTME — A Mí Tampoco Me Explicaron · Podcast de Christian Villamar',
  description:
    'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo. Conducido por Christian Villamar.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'A Mí Tampoco Me Explicaron',
    description: 'Lo que pensamos, lo que sentimos, pero que nadie nos explicó.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const podcastSchema = {
    '@context': 'https://schema.org',
    '@type': 'Podcast',
    name: 'A Mí Tampoco Me Explicaron',
    description:
      'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo. Conducido por Christian Villamar.',
    url: 'https://www.amitampocomeexplicaron.com',
    author: {
      '@type': 'Person',
      name: 'Christian Villamar',
      url: 'https://instagram.com/YOSOYVILLAMAR',
    },
    image: 'https://www.amitampocomeexplicaron.com/og-image.jpg',
    potentialAction: {
      '@type': 'ListenAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://open.spotify.com/show/AMTME',
        actionPlatform: ['DesktopWebPlatform', 'MobileWebPlatform', 'MobileApplication'],
      },
    },
  };

  return (
    <html lang="es" className={`${inter.variable} ${archivoBlack.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSchema) }}
        />
      </head>
      <body>
        <RemoveLovableBadge />
        {children}
      </body>
    </html>
  );
}
