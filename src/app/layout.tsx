import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Josefin_Sans, Special_Elite } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-josefin',
  display: 'swap',
});

const specialElite = Special_Elite({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-special-elite',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AMTME Studio OS',
  description: 'Sistema operativo editorial, documental y operativo para AMTME.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${josefinSans.variable} ${specialElite.variable}`}
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
