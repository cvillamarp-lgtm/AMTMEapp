import Link from 'next/link';
import { episodes } from '@/lib/editorial/episodes';
import { Header } from '@/components/amtme/Header';
import { Footer } from '@/components/amtme/Footer';
import { Newsletter } from '@/components/amtme/Newsletter';
import { PlatformLinks } from '@/components/amtme/PlatformLinks';
import { SectionLabel } from '@/components/amtme/icons';

export default function EpisodiosPage() {
  return (
    <div className="min-h-screen bg-cream text-navy">
      <Header />

      <main>
        <section className="border-b border-navy/10 px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <SectionLabel kicker="Catálogo completo" title="Todos los episodios" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy/75">
              Conversaciones honestas sobre amor, apego, vínculos, límites y volver a uno mismo.
            </p>
          </div>
        </section>

        <section className="px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {episodes.map((ep) => (
                <Link
                  key={ep.slug}
                  href={`/episodios/${ep.slug}`}
                  className="group overflow-hidden rounded-3xl border border-navy/10 bg-white transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={ep.cover}
                      alt={ep.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-bluegray">
                      {ep.number} · {ep.duration}
                    </div>
                    <h3 className="mt-2 font-display text-xl text-navy">{ep.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy/65">{ep.excerpt}</p>
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
