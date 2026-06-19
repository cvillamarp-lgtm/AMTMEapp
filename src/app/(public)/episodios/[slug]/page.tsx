import Link from 'next/link';
import { notFound } from 'next/navigation';
import { episodes, getEpisodeBySlug } from '@/lib/editorial/episodes';
import { Header } from '@/components/amtme/Header';
import { Footer } from '@/components/amtme/Footer';
import { Newsletter } from '@/components/amtme/Newsletter';
import { PlatformLinks } from '@/components/amtme/PlatformLinks';
import { EpisodeSpotifyPlayer } from '@/components/amtme/SpotifyPlayer';
import { ArrowIcon, SectionLabel } from '@/components/amtme/icons';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return episodes.map((ep) => ({
    slug: ep.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const ep = getEpisodeBySlug(slug);

  if (!ep) {
    return {
      title: 'Episodio no encontrado',
    };
  }

  return {
    title: `${ep.title} · AMTME`,
    description: ep.excerpt,
    openGraph: {
      title: ep.title,
      description: ep.excerpt,
      type: 'article',
      url: `/episodios/${ep.slug}`,
      images: [
        {
          url: ep.cover,
          width: 1000,
          height: 1000,
        },
      ],
    },
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const ep = getEpisodeBySlug(slug);

  if (!ep) {
    notFound();
  }

  const others = episodes.filter((e) => e.slug !== ep.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-cream text-navy">
      <Header />

      <main>
        <section className="border-b border-navy/10">
          <div className="mx-auto max-w-[1320px] px-6 pb-16 pt-12 lg:px-12 lg:pb-24 lg:pt-16">
            <Link
              href="/episodios"
              className="inline-flex items-center gap-2 text-sm text-navy/70 hover:text-navy"
            >
              <ArrowIcon className="rotate-180" /> Volver
            </Link>

            <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-navy/10 shadow-soft">
                  <img
                    src={ep.cover}
                    alt={ep.title}
                    width={1000}
                    height={1000}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-bluegray">
                  <span className="rounded-full bg-navy px-3 py-1 text-[10px] font-bold text-cream">
                    {ep.number}
                  </span>
                  {ep.topic} · {ep.duration}
                </div>
                <h1 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] text-navy">
                  {ep.title}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-navy/75">{ep.description}</p>

                <div className="mt-10">
                  <EpisodeSpotifyPlayer episode={ep} variant="full" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    {
                      name: 'Spotify',
                      url: `https://open.spotify.com/episode/${ep.spotifyEpisodeId}`,
                    },
                    { name: 'Apple Podcasts', url: ep.applePodcastsUrl ?? '#' },
                    { name: 'YouTube', url: ep.youtubeUrl ?? '#' },
                    { name: 'iVoox', url: ep.ivooxUrl ?? '#' },
                  ].map((p) => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-4 py-2 text-xs font-medium text-navy transition-colors hover:border-navy hover:bg-navy hover:text-cream"
                    >
                      {p.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <SectionLabel kicker="Sigue escuchando" title="Otros episodios" />
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/episodios/${o.slug}`}
                  className="group overflow-hidden rounded-3xl border border-navy/10 bg-white transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={o.cover}
                      alt={o.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-bluegray">
                      {o.number} · {o.duration}
                    </div>
                    <h3 className="mt-2 font-display text-xl text-navy">{o.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Newsletter />
        <PlatformLinks />
      </main>

      <Footer />
    </div>
  );
}
