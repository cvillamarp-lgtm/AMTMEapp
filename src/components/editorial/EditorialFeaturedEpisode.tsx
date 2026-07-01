import Link from 'next/link';
import { BRAND } from '@/lib/constants';

const PLATFORM_LINKS = [
  { label: 'Spotify', href: BRAND.spotifyUrl },
  { label: 'Apple Podcasts', href: BRAND.applePodcastsUrl },
  { label: 'YouTube', href: BRAND.youtubeUrl },
  { label: 'iVoox', href: BRAND.ivooxUrl },
] as const;

export function EditorialFeaturedEpisode() {
  return (
    <section id="featured" className="px-6 py-24 lg:px-12 lg:py-32" aria-labelledby="featured-title">
      <div className="mx-auto max-w-[1320px]">
        <div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]" style={{ color: '#687680' }}>
            <span className="h-px w-8" style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }} />
            Episodio destacado
          </div>
          <h2 id="featured-title" className="mt-5 font-display text-4xl leading-none lg:text-6xl" style={{ color: '#0c1f36' }}>
            Lo que está sonando ahora
          </h2>
        </div>

        <article
          className="mt-12 grid grid-cols-1 overflow-hidden rounded-[2rem] shadow-card-hover lg:grid-cols-12"
          style={{ backgroundColor: '#0d0d0d', color: '#f5f2ea' }}
        >
          <div className="relative lg:col-span-5">
            <img
              src="/images/episode-cover-1.jpg"
              alt="Carátula editorial de episodio destacado de AMTME"
              className="aspect-square h-full w-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#0c1f36' }} />
              EPISODIO DESTACADO
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 p-8 lg:col-span-7 lg:p-12">
            <div>
              <div className="text-xs uppercase tracking-[0.25em]" style={{ color: '#90a4b8' }}>
                Apego · Dignidad · Volver a uno mismo
              </div>
              <h3 className="mt-4 font-display text-4xl leading-none lg:text-6xl">
                Por qué vuelves aunque ya lo sabes
              </h3>
              <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: 'rgba(245, 242, 234, 0.72)' }}>
                Esa parte de ti que ya entendió con la cabeza, pero todavía tiembla en el cuerpo. Un episodio sobre el ciclo, el apego y la dignidad que empieza cuando dejas de negociar tu paz.
              </p>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <iframe
                  title="AMTME en Spotify"
                  src={BRAND.spotifyEmbedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  loading="lazy"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <Link
                  href="/episodios"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-[2px]"
                  style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
                >
                  Ver episodios →
                </Link>

                <div className="flex flex-wrap gap-2">
                  {PLATFORM_LINKS.map((platform) => (
                    <a
                      key={platform.label}
                      href={platform.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:border-[#fee94b] hover:text-[#fee94b]"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: 'rgba(245, 242, 234, 0.82)' }}
                    >
                      {platform.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
