/**
 * CMS Fallback — Complete hardcoded landing page content
 * Used when Supabase is unavailable or CMS is not published
 */

import type { SitePage, SiteSection } from './types';

export const LANDING_FALLBACK_PAGE: SitePage = {
  id: 'fallback-home-page',
  user_id: '',
  slug: 'home',
  payload: {
    is_published: true,
    seo: {
      title: 'AMTME — A Mí Tampoco Me Explicaron · Podcast de Christian Villamar',
      description:
        'Podcast emocional sobre amor, apego, vínculos, límites y volver a uno mismo. Conducido por Christian Villamar.',
      ogTitle: 'A Mí Tampoco Me Explicaron',
      ogDescription:
        'Podcast para entender el amor, el apego, los vínculos, la dignidad y todo eso que sentimos.',
      ogImage: '/images/og-image.jpg',
    },
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const LANDING_FALLBACK_SECTIONS: SiteSection[] = [
  {
    id: 'fallback-hero',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'hero',
    is_visible: true,
    sort_order: 1,
    payload: {
      tagline: 'Episodio 014 · Nuevo',
      mainHeading: 'A mí tampoco me explicaron cómo se suelta lo que todavía duele.',
      subtitle:
        'Un podcast para entender el amor, el apego, los vínculos, la dignidad y todo eso que sentimos, pero que nadie nos enseñó a nombrar.',
      primaryCta: 'Escuchar episodio destacado',
      secondaryCta: 'Ver episodios',
      imageUrl: '/images/christian-hero-headshot.jpg',
      imageAlt: 'Christian Villamar - Host de A Mí Tampoco Me Explicaron',
      stats: [
        { label: 'Temporadas', value: '03' },
        { label: 'Episodios', value: '42' },
        { label: 'Oyentes', value: '120K+' },
      ],
      topics: [
        'Amor vs apego',
        'Dignidad',
        'Volver a uno mismo',
        'Duelo emocional',
        'Límites',
        'Rechazo',
        'Ansiedad afectiva',
        'Tarot como espejo',
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-featured-episode',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'featured_episode',
    is_visible: true,
    sort_order: 2,
    payload: {
      sectionLabel: 'Episodio destacado',
      sectionTitle: 'Lo que está sonando ahora',
      episodeLabel: 'Apego · Dignidad · 48 min',
      episodeBadge: 'NUEVO · EP 014',
      episodeTitle: 'Por qué vuelves aunque ya lo sabes',
      episodeDescription:
        'Esa cosa rara donde la mente entiende, el cuerpo recuerda y la historia vuelve a llamarte a la puerta. Un episodio sobre el ciclo, el cuerpo y lo que realmente se está soltando cuando crees que estás soltando.',
      imageUrl: '/episode-cover-1.jpg',
      imageAlt: 'Por qué vuelves aunque ya lo sabes',
      spotifyEmbedUrl: '',
      episodeUrl: '/episodios/por-que-vuelves-aunque-ya-lo-sabes',
      spotifyUrl: '',
      applePodcastsUrl: '',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-about',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'about',
    is_visible: true,
    sort_order: 3,
    payload: {
      sectionLabel: 'Qué es AMTME',
      sectionTitle: 'Una casa para los que sintieron demasiado.',
      paragraphs: [
        'AMTME es un espacio para quienes han sentido demasiado, han explicado demasiado, han esperado demasiado y un día necesitan volver a escucharse.',
        'No viene a darte respuestas perfectas. Viene a acompañarte mientras encuentras las tuyas. Aquí no hablamos desde el pedestal — hablamos desde el camino, con honestidad, vulnerabilidad y una mirada simbólica que usa el tarot como espejo de conciencia.',
        'No prometemos arreglarte. Te recordamos que no estás roto: estás entendiendo tarde lo que nadie te enseñó a tiempo.',
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-topics',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'topics',
    is_visible: true,
    sort_order: 4,
    payload: {
      sectionTitle: 'Temas que exploramos',
      topics: [
        { name: 'Amor vs Apego', description: 'Diferencias y patrones' },
        { name: 'Dignidad', description: 'Reconocer tu valor' },
        { name: 'Volver a Uno Mismo', description: 'Reconstrucción personal' },
        { name: 'Duelo Emocional', description: 'Procesos de soltar' },
        { name: 'Límites', description: 'Protección emocional' },
        { name: 'Rechazo', description: 'Manejo y recuperación' },
        { name: 'Ansiedad Afectiva', description: 'Patrones de apego' },
        { name: 'Tarot como Espejo', description: 'Conciencia simbólica' },
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-recent-episodes',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'recent_episodes',
    is_visible: true,
    sort_order: 5,
    payload: {
      sectionLabel: 'Catálogo completo',
      sectionTitle: 'Episodios recientes',
      episodes: [
        {
          id: 1,
          title: 'Por qué vuelves aunque ya lo sabes',
          number: '014',
          duration: '48 min',
          description: 'Sobre el ciclo, el cuerpo y lo que realmente se está soltando',
          tags: ['Apego', 'Dignidad'],
          url: '/episodios/por-que-vuelves-aunque-ya-lo-sabes',
          imageUrl: '/episode-cover-1.jpg',
        },
        {
          id: 2,
          title: 'No era intensidad, era una herida',
          number: '013',
          duration: '52 min',
          description: 'Reconocer el dolor como información',
          tags: ['Heridas', 'Vulnerabilidad'],
          url: '/episodios/no-era-intensidad-era-una-herida',
          imageUrl: '/episode-cover-2.jpg',
        },
        {
          id: 3,
          title: 'Soltar sin pedir permiso',
          number: '012',
          duration: '45 min',
          description: 'El acto de soltar como acto de amor propio',
          tags: ['Soltar', 'Dignidad'],
          url: '/episodios/soltar-sin-pedir-permiso',
          imageUrl: '/episode-cover-3.jpg',
        },
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-manifesto',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'manifesto',
    is_visible: true,
    sort_order: 6,
    payload: {
      sectionLabel: 'Nuestro propósito',
      sectionTitle: 'El manifiesto de AMTME',
      manifestoPoints: [
        'Creemos que sentir profundamente no es debilidad.',
        'Creemos que necesitas permiso para tu propia dignidad.',
        'Creemos en la vulnerabilidad como fortaleza.',
        'Creemos en sanar desde la honestidad.',
        'Creemos que mereces ser escuchado sin juzgamientos.',
        'Creemos que el camino solitario no tiene que ser solitario.',
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-about-christian',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'about_christian',
    is_visible: true,
    sort_order: 7,
    payload: {
      sectionLabel: 'Conoce al host',
      name: 'Christian Villamar',
      title: 'Productor de audio y facilitador emocional',
      bio: 'Christian es un facilitador que ha trabajado en el espacio del bienestar emocional y la comunicación consciente. Su voz es la brújula que guía cada episodio de AMTME.',
      imageUrl: '/images/christian-profile.jpg',
      imageAlt: 'Christian Villamar',
      socialLinks: {
        instagram: 'https://instagram.com/amitampocomeexplicaron',
        spotify: 'https://open.spotify.com/show/',
        linkedin: 'https://linkedin.com/in/christianvillamar',
      },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-newsletter',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'newsletter',
    is_visible: true,
    sort_order: 8,
    payload: {
      sectionLabel: 'Mantente conectado',
      sectionTitle: 'Suscríbete a nuestro newsletter',
      subtitle: 'Reflexiones semanales directo a tu inbox. Sin spam, solo contenido que resuena.',
      placeholderText: 'Tu correo aquí',
      ctaText: 'Suscribirse',
      successMessage: 'Gracias por suscribirte',
      formAction: '/api/email',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-platforms',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'platforms',
    is_visible: true,
    sort_order: 9,
    payload: {
      sectionTitle: 'Escúchanos en todas partes',
      platforms: [
        {
          name: 'Spotify',
          url: 'https://open.spotify.com/show/',
          icon: 'spotify',
        },
        {
          name: 'Apple Podcasts',
          url: 'https://podcasts.apple.com/podcast/',
          icon: 'apple',
        },
        {
          name: 'YouTube',
          url: 'https://youtube.com/@amitampocomeexplicaron',
          icon: 'youtube',
        },
        {
          name: 'Instagram',
          url: 'https://instagram.com/amitampocomeexplicaron',
          icon: 'instagram',
        },
        {
          name: 'TikTok',
          url: 'https://tiktok.com/@amitampocomeexplicaron',
          icon: 'tiktok',
        },
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-footer',
    page_id: 'fallback-home-page',
    user_id: '',
    section_key: 'footer',
    is_visible: true,
    sort_order: 10,
    payload: {
      brandName: 'AMTME',
      brandTagline: 'A Mí Tampoco Me Explicaron',
      copyright: '© 2024 Christian Villamar. Todos los derechos reservados.',
      footerLinks: [
        { label: 'Privacidad', url: '/privacy' },
        { label: 'Términos', url: '/terms' },
        { label: 'Contacto', url: 'mailto:contacto@amtme.com' },
      ],
      socialLinks: [
        {
          name: 'Instagram',
          url: 'https://instagram.com/amitampocomeexplicaron',
        },
        {
          name: 'Spotify',
          url: 'https://open.spotify.com/show/',
        },
        {
          name: 'YouTube',
          url: 'https://youtube.com/@amitampocomeexplicaron',
        },
        {
          name: 'TikTok',
          url: 'https://tiktok.com/@amitampocomeexplicaron',
        },
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Get landing page with fallback
 * Returns fallback if page is null or missing critical data
 */
export function getLandingPageWithFallback(page: SitePage | null): SitePage {
  if (!page) {
    return LANDING_FALLBACK_PAGE;
  }

  // Verify critical fields
  if (!page.id || !page.slug || !page.payload) {
    return LANDING_FALLBACK_PAGE;
  }

  return page;
}

/**
 * Get section payload with fallback
 * Returns fallback section if cms section is null or incomplete
 */
export function getSectionPayloadWithFallback(
  cmsSection: SiteSection | null,
  sectionKey: string
): Record<string, unknown> {
  if (!cmsSection) {
    const fallback = LANDING_FALLBACK_SECTIONS.find((s) => s.section_key === sectionKey);
    return fallback?.payload || {};
  }

  if (!cmsSection.payload || Object.keys(cmsSection.payload).length === 0) {
    const fallback = LANDING_FALLBACK_SECTIONS.find((s) => s.section_key === sectionKey);
    return fallback?.payload || {};
  }

  return cmsSection.payload;
}
