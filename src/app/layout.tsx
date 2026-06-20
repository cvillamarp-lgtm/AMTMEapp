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
  return (
    <html lang="es" className={`${inter.variable} ${archivoBlack.variable}`}>
      <body>
        <RemoveLovableBadge />
        {children}
      </body>
    </html>
  );
}
