import type {
  LandingSection,
  HeroSectionContent,
  FeaturedEpisodeSectionContent,
  AboutSectionContent,
  TopicsSectionContent,
  RecentEpisodesSectionContent,
  ManifestoSectionContent,
  AboutChristianSectionContent,
  NewsletterSectionContent,
  PlatformsSectionContent,
  FooterSectionContent,
} from '@/types/database';

/**
 * Complete fallback content for all 10 landing sections.
 * Used when CMS database is unavailable or sections aren't configured.
 */
export const landingSectionsFallback: Array<
  Omit<
    LandingSection,
    'id' | 'landing_page_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'
  >
> = [
  {
    section_key: 'hero',
    section_order: 0,
    is_visible: true,
    content: {
      title: 'AMITAMPOCOMEEXPLICARON',
      subtitle: 'Historias que liberan',
      description:
        'Un podcast sobre claridad emocional, relaciones y todo aquello que nos mantiene atrapados',
      cta_text: 'Escuchar primero episodio',
      cta_url: 'https://open.spotify.com/show/amitampocomeexplicaron',
      hero_image_url:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
    } as HeroSectionContent,
  },
  {
    section_key: 'featured_episode',
    section_order: 1,
    is_visible: true,
    content: {
      title: 'Episodio Destacado',
      episode_title: 'No era intensidad, era una herida',
      episode_description:
        'Explora cómo la intensidad emocional puede enmascarar heridas profundas',
      episode_url: '/episodios/no-era-intensidad-era-una-herida',
      episode_image_url:
        'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=400&fit=crop',
    } as FeaturedEpisodeSectionContent,
  },
  {
    section_key: 'about',
    section_order: 2,
    is_visible: true,
    content: {
      title: 'Sobre el Podcast',
      description:
        'AMITAMPOCOMEEXPLICARON es un espacio de profundidad emocional. Cada episodio explora temas que afectan nuestras relaciones y autoconocimiento.',
      cta_text: 'Conocer más',
      cta_url: '/sobre',
    } as AboutSectionContent,
  },
  {
    section_key: 'topics',
    section_order: 3,
    is_visible: true,
    content: {
      title: 'Temas Explorados',
      topics: [
        { name: 'Relaciones', icon: 'heart' },
        { name: 'Claridad', icon: 'lightbulb' },
        { name: 'Emociones', icon: 'brain' },
        { name: 'Autoconocimiento', icon: 'person' },
      ],
    } as TopicsSectionContent,
  },
  {
    section_key: 'recent_episodes',
    section_order: 4,
    is_visible: true,
    content: {
      title: 'Episodios Recientes',
      description: 'Conoce nuestros últimos episodios publicados',
      show_count: 6,
    } as RecentEpisodesSectionContent,
  },
  {
    section_key: 'manifesto',
    section_order: 5,
    is_visible: true,
    content: {
      title: 'Nuestro Manifiesto',
      content:
        'Creemos en la claridad emocional como herramienta de transformación. En una sociedad que nos enseña a silenciar, elegimos hablar verdad.',
      cta_text: 'Leer completo',
      cta_url: '/sobre',
    } as ManifestoSectionContent,
  },
  {
    section_key: 'about_christian',
    section_order: 6,
    is_visible: true,
    content: {
      title: 'Acerca del Host',
      name: 'Christian Tebaldi',
      bio: 'Facilitador de claridad emocional con 15 años de experiencia en desarrollo personal y relaciones.',
      image_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      cta_text: 'Conectar',
      cta_url: 'https://www.instagram.com/amitampocomeexplicaron/',
    } as AboutChristianSectionContent,
  },
  {
    section_key: 'newsletter',
    section_order: 7,
    is_visible: true,
    content: {
      title: 'Suscribirse a Novedades',
      description:
        'Recibe reflexiones semanales sobre claridad emocional directamente en tu bandeja de entrada',
      placeholder: 'tu@email.com',
      cta_text: 'Suscribirse',
    } as NewsletterSectionContent,
  },
  {
    section_key: 'platforms',
    section_order: 8,
    is_visible: true,
    content: {
      title: 'Escucha en tu plataforma favorita',
      platforms: [
        {
          name: 'Spotify',
          url: 'https://open.spotify.com/show/amitampocomeexplicaron',
          icon: 'spotify',
        },
        {
          name: 'Apple Podcasts',
          url: 'https://podcasts.apple.com/amitampocomeexplicaron',
          icon: 'apple',
        },
        { name: 'YouTube', url: 'https://youtube.com/@amitampocomeexplicaron', icon: 'youtube' },
        {
          name: 'Instagram',
          url: 'https://instagram.com/amitampocomeexplicaron',
          icon: 'instagram',
        },
      ],
    } as PlatformsSectionContent,
  },
  {
    section_key: 'footer',
    section_order: 9,
    is_visible: true,
    content: {
      copyright: '© 2026 AMITAMPOCOMEEXPLICARON. Todos los derechos reservados.',
      links: [
        { text: 'Política de Privacidad', url: '/privacy' },
        { text: 'Términos de Servicio', url: '/terms' },
        { text: 'Contacto', url: 'mailto:hello@amitampocomeexplicaron.com' },
      ],
    } as FooterSectionContent,
  },
];
