export type Episode = {
  slug: string;
  number: string;
  title: string;
  topic: string;
  excerpt: string;
  description: string;
  duration: string;
  publishedAt: string;
  cover: string;
  // Spotify episode ID — replace with real values from open.spotify.com/episode/<ID>
  spotifyEpisodeId: string;
  applePodcastsUrl?: string;
  youtubeUrl?: string;
  ivooxUrl?: string;
};

export const episodes: Episode[] = [
  {
    slug: 'por-que-vuelves-aunque-ya-lo-sabes',
    number: 'EP 014',
    title: 'Por qué vuelves aunque ya lo sabes',
    topic: 'Apego · Dignidad',
    excerpt:
      'Sobre ese ciclo donde la mente entiende pero el cuerpo todavía busca lo que lo hirió.',
    description:
      'Esa cosa rara donde la mente entiende, el cuerpo recuerda y la historia vuelve a llamarte a la puerta. Un episodio sobre el ciclo, el cuerpo y lo que realmente se está soltando cuando crees que estás soltando.',
    duration: '48 min',
    publishedAt: '2026-06-10',
    cover: '/images/episode-cover-1.jpg',
    spotifyEpisodeId: 'REPLACE_WITH_REAL_EPISODE_ID_014',
    applePodcastsUrl: '#',
    youtubeUrl: '#',
    ivooxUrl: '#',
  },
  {
    slug: 'no-era-intensidad-era-una-herida',
    number: 'EP 013',
    title: 'No era intensidad, era una herida',
    topic: 'Amor vs apego',
    excerpt:
      'Cuando confundimos la urgencia emocional con conexión y llamamos amor a lo que solo era miedo.',
    description:
      'Hablamos sobre cómo nuestras heridas más antiguas suelen disfrazarse de pasión. Lo que llamamos intensidad muchas veces es el sistema nervioso pidiendo regulación, no amor.',
    duration: '52 min',
    publishedAt: '2026-05-27',
    cover: '/images/episode-cover-2.jpg',
    spotifyEpisodeId: 'REPLACE_WITH_REAL_EPISODE_ID_013',
    applePodcastsUrl: '#',
    youtubeUrl: '#',
    ivooxUrl: '#',
  },
  {
    slug: 'soltar-sin-pedir-permiso',
    number: 'EP 012',
    title: 'Soltar sin pedir permiso',
    topic: 'Límites · Duelo',
    excerpt:
      'Una conversación íntima sobre cerrar capítulos sin necesitar la aprobación de quien te rompió.',
    description:
      'No siempre vas a recibir el cierre que mereces. Y aun así puedes irte. Este episodio es sobre darte permiso de soltar incluso cuando el otro no entiende, no responde o no quiere ver.',
    duration: '41 min',
    publishedAt: '2026-05-13',
    cover: '/images/episode-cover-3.jpg',
    spotifyEpisodeId: 'REPLACE_WITH_REAL_EPISODE_ID_012',
    applePodcastsUrl: '#',
    youtubeUrl: '#',
    ivooxUrl: '#',
  },
];

export const featuredEpisode = episodes[0];

export function getEpisodeBySlug(slug: string) {
  return episodes.find((e) => e.slug === slug);
}
