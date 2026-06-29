'use client';

interface CmsHeroData {
  cms?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}

interface EditorialHeroProps extends CmsHeroData {
  onListenClick?: () => void;
  onEpisodesClick?: () => void;
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}

export function EditorialHero({
  onListenClick,
  onEpisodesClick,
  cmsData = {},
  fallbackData = {},
}: EditorialHeroProps) {
  // Extract data with fallbacks
  const cms = (cmsData as Record<string, unknown>)?.cms as Record<string, unknown> | undefined;
  const fallback = (fallbackData as Record<string, unknown>)?.cms as
    | Record<string, unknown>
    | undefined;

  const tagline =
    (cms?.tagline as string) || (fallback?.tagline as string) || 'Episodio 014 · Nuevo';
  const mainHeading =
    (cms?.mainHeading as string) ||
    (fallback?.mainHeading as string) ||
    'A mí tampoco me explicaron cómo se suelta lo que todavía duele.';
  const subtitle =
    (cms?.subtitle as string) ||
    (fallback?.subtitle as string) ||
    'Un podcast para entender el amor, el apego, los vínculos, la dignidad y todo eso que sentimos, pero que nadie nos enseñó a nombrar.';
  const primaryCta =
    (cms?.primaryCta as string) ||
    (fallback?.primaryCta as string) ||
    'Escuchar episodio destacado';
  const secondaryCta =
    (cms?.secondaryCta as string) || (fallback?.secondaryCta as string) || 'Ver episodios';
  const imageUrl =
    (cms?.imageUrl as string) ||
    (fallback?.imageUrl as string) ||
    '/images/christian-hero-headshot.jpg';
  const imageAlt =
    (cms?.imageAlt as string) ||
    (fallback?.imageAlt as string) ||
    'Christian Villamar - Host de A Mí Tampoco Me Explicaron';
  const stats = (cms?.stats as Array<{ label: string; value: string }>) ||
    (fallback?.stats as Array<{ label: string; value: string }>) || [
      { label: 'Temporadas', value: '03' },
      { label: 'Episodios', value: '42' },
      { label: 'Oyentes', value: '120K+' },
    ];
  const topics = (cms?.topics as string[]) ||
    (fallback?.topics as string[]) || [
      'Amor vs apego',
      'Dignidad',
      'Volver a uno mismo',
      'Duelo emocional',
      'Límites',
      'Rechazo',
      'Ansiedad afectiva',
      'Tarot como espejo',
    ];

  return (
    <section
      style={{ borderBottomColor: 'rgba(12, 31, 54, 0.1)' }}
      className="relative overflow-hidden border-b"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-20 pt-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="lg:col-span-7">
          <div
            className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
            style={{ color: '#687680' }}
          >
            <span className="h-px w-10" style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}></span>
            {tagline}
          </div>

          <h1
            className="font-black text-[clamp(2.4rem,7vw,6.8rem)] leading-[0.95] tracking-tight"
            style={{
              color: '#0c1f36',
            }}
          >
            {mainHeading.split(' ').slice(0, 3).join(' ')}{' '}
            <span className="relative inline-block">
              {mainHeading.split(' ')[3]}
              <span
                className="absolute bottom-1 left-0 right-0 h-3"
                style={{ backgroundColor: 'rgba(254, 233, 75, 0.7)', zIndex: -1 }}
              ></span>
            </span>{' '}
            <span className="relative inline-block">
              {mainHeading.split(' ').slice(4).join(' ')}
              <span
                className="absolute bottom-1 left-0 right-0 h-3"
                style={{ backgroundColor: 'rgba(254, 233, 75, 0.7)', zIndex: -1 }}
              ></span>
            </span>
          </h1>

          <p
            className="mt-8 max-w-xl text-lg leading-relaxed"
            style={{ color: 'rgba(12, 31, 54, 0.75)' }}
          >
            {subtitle}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <button
              onClick={onListenClick}
              className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-soft"
              style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4l14 8-14 8V4z"></path>
              </svg>
              {primaryCta}
            </button>

            <button
              onClick={onEpisodesClick}
              className="inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-sm font-bold transition-all hover:bg-navy hover:text-cream"
              style={{ borderColor: '#0c1f36', color: '#0c1f36' }}
            >
              {secondaryCta}
            </button>
          </div>

          {/* Stats */}
          <dl
            className="mt-16 grid max-w-md grid-cols-3 gap-6 border-t pt-8 text-sm"
            style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs uppercase tracking-wider" style={{ color: '#687680' }}>
                  {stat.label}
                </dt>
                <dd className="mt-1 font-bold text-2xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Hero Image */}
        <div className="relative lg:col-span-5">
          <div
            className="absolute -left-6 top-12 z-0 hidden h-72 w-72 rounded-full blur-[120px] lg:block"
            style={{ backgroundColor: 'rgba(254, 233, 75, 0.7)' }}
          ></div>
          <div
            className="relative z-10 overflow-hidden rounded-3xl border"
            style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
          >
            <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute -bottom-4 -right-4 z-20 hidden rounded-2xl px-5 py-4 text-white md:block"
            style={{ backgroundColor: '#0c1f36' }}
          >
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
              Host
            </div>
            <div className="mt-1 font-bold text-lg">Christian Villamar</div>
          </div>
        </div>
      </div>

      {/* Topics Marquee */}
      <div
        className="overflow-hidden border-t"
        style={{
          borderColor: 'rgba(12, 31, 54, 0.1)',
          backgroundColor: '#0c1f36',
          color: '#f5f2ea',
        }}
      >
        <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap py-6">
          {topics.map((tema, i) => (
            <span key={i} className="mx-12 font-black text-xl tracking-widest md:text-2xl">
              {tema}
              <span className="ml-12" style={{ color: '#fee94b' }}>
                ✦
              </span>
            </span>
          ))}
          {topics.map((tema, i) => (
            <span key={`r-${i}`} className="mx-12 font-black text-xl tracking-widest md:text-2xl">
              {tema}
              <span className="ml-12" style={{ color: '#fee94b' }}>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
