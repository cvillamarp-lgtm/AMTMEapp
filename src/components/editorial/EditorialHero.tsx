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

const DEFAULT_TOPICS = [
  'Amor vs apego',
  'Dignidad',
  'Volver a uno mismo',
  'Duelo emocional',
  'Límites',
  'Rechazo',
  'Ansiedad afectiva',
  'Tarot como espejo',
];

function scrollTo(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderEditorialHeading(mainHeading: string) {
  const defaultHeading = 'A mí tampoco me explicaron cómo se suelta lo que todavía duele.';

  if (mainHeading !== defaultHeading) {
    return mainHeading;
  }

  return (
    <>
      A mí tampoco me explicaron{' '}
      <span className="underline-lime inline-block">cómo se suelta</span> lo que todavía duele.
    </>
  );
}

export function EditorialHero({
  onListenClick,
  onEpisodesClick,
  cmsData = {},
  fallbackData = {},
}: EditorialHeroProps) {
  const cms = (cmsData as Record<string, unknown>)?.cms as Record<string, unknown> | undefined;
  const fallback = (fallbackData as Record<string, unknown>)?.cms as
    | Record<string, unknown>
    | undefined;

  const tagline =
    (cms?.tagline as string) || (fallback?.tagline as string) || 'Podcast emocional · AMTME';
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
    'Christian Villamar, host de A Mí Tampoco Me Explicaron';
  const stats = (cms?.stats as Array<{ label: string; value: string }>) ||
    (fallback?.stats as Array<{ label: string; value: string }>) || [
      { label: 'Episodios', value: '30+' },
      { label: 'Territorios', value: '08' },
      { label: 'Comunidad', value: 'MX/LATAM' },
    ];
  const topics = (cms?.topics as string[]) || (fallback?.topics as string[]) || DEFAULT_TOPICS;

  const handleListen = () => {
    if (onListenClick) {
      onListenClick();
      return;
    }
    scrollTo('featured');
  };

  const handleEpisodes = () => {
    if (onEpisodesClick) {
      onEpisodesClick();
      return;
    }
    scrollTo('episodios');
  };

  return (
    <section
      aria-labelledby="amtme-hero-title"
      className="relative overflow-hidden border-b"
      style={{ borderBottomColor: 'rgba(12, 31, 54, 0.1)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            'radial-gradient(circle at 80% 12%, rgba(254, 233, 75, 0.32), transparent 28%), radial-gradient(circle at 12% 74%, rgba(224, 33, 30, 0.08), transparent 26%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-20 pt-16 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="lg:col-span-7">
          <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.25em]" style={{ color: '#687680' }}>
            <span className="h-px w-10" style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }} />
            {tagline}
          </div>

          <h1
            id="amtme-hero-title"
            className="font-display max-w-5xl text-[clamp(2.35rem,7vw,6.6rem)] leading-[0.94] tracking-tight"
            style={{ color: '#0c1f36' }}
          >
            {renderEditorialHeading(mainHeading)}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: 'rgba(12, 31, 54, 0.75)' }}>
            {subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleListen}
              className="inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold shadow-soft transition-transform hover:-translate-y-[2px] active:translate-y-0"
              style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 4l14 8-14 8V4z" />
              </svg>
              {primaryCta}
            </button>

            <button
              type="button"
              onClick={handleEpisodes}
              className="inline-flex items-center gap-2 rounded-full border px-7 py-4 text-sm font-semibold transition-colors hover:bg-[#0c1f36] hover:text-[#f5f2ea]"
              style={{ borderColor: '#0c1f36', color: '#0c1f36' }}
            >
              {secondaryCta}
            </button>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t pt-8 text-sm" style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#687680' }}>
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-xl leading-none md:text-2xl" style={{ color: '#0c1f36' }}>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div
            aria-hidden="true"
            className="absolute -left-8 top-12 z-0 hidden h-72 w-72 rounded-full blur-[90px] lg:block"
            style={{ backgroundColor: 'rgba(254, 233, 75, 0.62)' }}
          />
          <div
            className="relative z-10 overflow-hidden rounded-[2rem] border shadow-soft"
            style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
          >
            <img src={imageUrl} alt={imageAlt} className="aspect-[4/5] h-full w-full object-cover" />
          </div>
          <div
            className="absolute -bottom-4 -right-4 z-20 hidden rounded-2xl px-5 py-4 md:block"
            style={{ backgroundColor: '#0c1f36', color: '#f5f2ea' }}
          >
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
              Host
            </div>
            <div className="mt-1 font-display text-lg">Christian Villamar</div>
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden border-t"
        style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#0c1f36', color: '#f5f2ea' }}
      >
        <div className="editorial-marquee flex whitespace-nowrap py-5">
          {[...topics, ...topics, ...topics].map((tema, i) => (
            <span key={`${tema}-${i}`} className="mx-10 font-display text-xl tracking-wide md:text-2xl">
              {tema}
              <span className="ml-10" style={{ color: '#fee94b' }}>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
