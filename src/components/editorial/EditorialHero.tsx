'use client';

interface EditorialHeroProps {
  onListenClick?: () => void;
  onEpisodesClick?: () => void;
}

export function EditorialHero({ onListenClick, onEpisodesClick }: EditorialHeroProps) {
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
            Episodio 014 · Nuevo
          </div>

          <h1
            className="font-black text-[clamp(2.4rem,7vw,6.8rem)] leading-[0.95] tracking-tight"
            style={{
              color: '#0c1f36',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            A mí tampoco me{' '}
            <span className="relative inline-block">
              explicaron cómo se suelta
              <span
                className="absolute bottom-2 left-0 right-0 h-4"
                style={{ backgroundColor: 'rgba(254, 233, 75, 0.65)', zIndex: -1 }}
              ></span>
            </span>{' '}
            lo que todavía duele.
          </h1>

          <p
            className="mt-8 max-w-xl text-lg leading-relaxed"
            style={{ color: 'rgba(12, 31, 54, 0.75)' }}
          >
            Un podcast para entender el amor, el apego, los vínculos, la dignidad y todo eso que
            sentimos, pero que nadie nos enseñó a nombrar.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={onListenClick}
              className="inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-black transition-transform hover:-translate-y-[2px] shadow-soft"
              style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4l14 8-14 8V4z"></path>
              </svg>
              Escuchar episodio destacado
            </button>

            <button
              onClick={onEpisodesClick}
              className="inline-flex items-center gap-2 rounded-full border-2 px-7 py-4 text-sm font-black transition-colors hover:bg-navy hover:text-cream"
              style={{ borderColor: '#0c1f36', color: '#0c1f36' }}
            >
              Ver episodios
            </button>
          </div>

          {/* Stats */}
          <dl
            className="mt-16 grid max-w-md grid-cols-3 gap-6 border-t pt-8 text-sm"
            style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
          >
            <div>
              <dt className="text-xs uppercase tracking-wider" style={{ color: '#687680' }}>
                Temporadas
              </dt>
              <dd className="mt-1 font-bold text-2xl">03</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider" style={{ color: '#687680' }}>
                Episodios
              </dt>
              <dd className="mt-1 font-bold text-2xl">42</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider" style={{ color: '#687680' }}>
                Oyentes
              </dt>
              <dd className="mt-1 font-bold text-2xl">120K+</dd>
            </div>
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
            <img
              src="/images/christian-hero-headshot.jpg"
              alt="Christian Villamar - Host de A Mí Tampoco Me Explicaron"
              className="h-full w-full object-cover"
            />
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
        <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap py-5">
          {[
            'Amor vs apego',
            'Dignidad',
            'Volver a uno mismo',
            'Duelo emocional',
            'Límites',
            'Rechazo',
            'Ansiedad afectiva',
            'Tarot como espejo',
          ].map((tema, i) => (
            <span key={i} className="mx-10 font-bold text-2xl tracking-wide">
              {tema}
              <span className="ml-10" style={{ color: '#fee94b' }}>
                ✦
              </span>
            </span>
          ))}
          {[
            'Amor vs apego',
            'Dignidad',
            'Volver a uno mismo',
            'Duelo emocional',
            'Límites',
            'Rechazo',
            'Ansiedad afectiva',
            'Tarot como espejo',
          ].map((tema, i) => (
            <span key={`r-${i}`} className="mx-10 font-bold text-2xl tracking-wide">
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
