// Brand constants for AMTME — A Mí Tampoco Me Explicaron
export const BRAND = {
  name: 'A Mí Tampoco Me Explicaron',
  short: 'AMTME',
  host: 'Christian Villamar',
  handle: '@YOSOYVILLAMAR',
  tagline: 'Lo que pensamos, lo que sentimos, pero que nadie nos explicó.',
  email: 'hola@amtme.com',
  instagram: 'https://instagram.com/YOSOYVILLAMAR',
  // NOTE: Replace with the real Spotify show ID for AMTME.
  // From a Spotify URL like https://open.spotify.com/show/<SHOW_ID>
  spotifyShowId: 'REPLACE_WITH_REAL_SHOW_ID',
} as const;

export const COLORS = {
  navy: '#0C1F36',
  lime: '#FEE94B',
  cream: '#F5F2EA',
  white: '#FFFFFF',
  red: '#E0211E',
  ink: '#111111',
  bluegray: '#90A4B8',
} as const;

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Episodios', href: '/#episodios' },
  { label: 'Sobre AMTME', href: '/#manifiesto' },
  { label: 'Christian', href: '/#christian' },
  { label: 'Newsletter', href: '/#newsletter' },
] as const;
