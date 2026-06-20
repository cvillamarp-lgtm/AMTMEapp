import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Josefin_Sans, Crimson_Text, JetBrains_Mono } from 'next/font/google';
import { RemoveLovableBadge } from '@/components/remove-lovable-badge';
import './globals.css';

// Display font for headers
const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-josefin',
  display: 'swap',
});

// Body font for readability
const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
});

// Monospace for code
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'A Mí Tampoco Me Explicaron',
  description: 'Pódcast sobre amor, apego e identidad. Escucha gratis en Spotify.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'A Mí Tampoco Me Explicaron',
    description: 'Un pódcast honesto sobre amor, apego, identidad y todo eso que sentimos.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${josefinSans.variable} ${crimsonText.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <RemoveLovableBadge />
        {children}
      </body>
    </html>
  );
}
