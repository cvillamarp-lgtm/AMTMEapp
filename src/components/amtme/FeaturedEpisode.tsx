import { featuredEpisode } from '@/lib/editorial/episodes';
import { SectionLabel } from './icons';
import { EpisodeSpotifyPlayer } from './SpotifyPlayer';

export function FeaturedEpisode() {
  const ep = featuredEpisode;
  return (
    <section id="featured" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionLabel kicker="Episodio destacado" title="Lo que está sonando ahora" />
        <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-3xl bg-ink text-cream shadow-soft lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <img
              src={ep.cover}
              alt={`Carátula · ${ep.title}`}
              width={800}
              height={800}
              loading="lazy"
              className="aspect-square h-full w-full object-cover"
            />
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-xs font-bold text-navy">
              <span className="h-1.5 w-1.5 rounded-full bg-navy" /> NUEVO · {ep.number}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-8 p-8 lg:col-span-7 lg:p-12">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-bluegray">
                {ep.topic} · {ep.duration}
              </div>
              <h3 className="mt-4 font-display text-4xl text-cream lg:text-6xl">{ep.title}</h3>
              <p className="mt-6 max-w-xl text-cream/70">{ep.description}</p>
            </div>
            <div className="space-y-6">
              <EpisodeSpotifyPlayer episode={ep} variant="compact" />
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 pt-6">
                <a
                  href={`/episodios/${ep.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-navy"
                >
                  Ver episodio completo →
                </a>
                <div className="flex flex-wrap gap-2">
                  {['Spotify', 'Apple Podcasts', 'YouTube', 'iVoox'].map((p) => (
                    <a
                      key={p}
                      href="#"
                      className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-xs font-medium text-cream/80 transition-colors hover:border-lime hover:text-lime"
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
