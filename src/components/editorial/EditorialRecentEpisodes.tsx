'use client';

import Link from 'next/link';

interface Episode {
  slug: string;
  title: string;
  tags: string;
  time: string;
  desc: string;
  ep: string;
  img: string;
}

const RECENT_EPISODES: Episode[] = [
  {
    slug: 'por-que-vuelves-aunque-ya-lo-sabes',
    title: 'Por qué vuelves aunque ya lo sabes',
    tags: 'Apego · Dignidad',
    time: '48 min',
    desc: 'Sobre ese ciclo donde la mente entiende pero el cuerpo todavía busca lo que lo hirió.',
    ep: '014',
    img: '/episode-cover-1.jpg',
  },
  {
    slug: 'no-era-intensidad-era-una-herida',
    title: 'No era intensidad, era una herida',
    tags: 'Amor vs apego',
    time: '52 min',
    desc: 'Cuando confundimos la urgencia emocional con conexión y llamamos amor a lo que solo era miedo.',
    ep: '013',
    img: '/episode-cover-2.jpg',
  },
  {
    slug: 'soltar-sin-pedir-permiso',
    title: 'Soltar sin pedir permiso',
    tags: 'Límites · Duelo',
    time: '41 min',
    desc: 'Una conversación íntima sobre cerrar capítulos sin necesitar la aprobación de quien te rompió.',
    ep: '012',
    img: '/episode-cover-3.jpg',
  },
];

export function EditorialRecentEpisodes() {
  return (
    <section id="episodios" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
              style={{ color: '#687680' }}
            >
              <span
                className="h-px w-8"
                style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}
              ></span>
              Catálogo
            </div>
            <h2 className="mt-5 font-bold text-4xl lg:text-6xl">Episodios recientes.</h2>
          </div>
          <Link
            href="/episodios"
            className="text-sm font-semibold relative inline-block"
            style={{ color: '#0c1f36' }}
          >
            <span className="relative inline-block">
              Ver todos los episodios →
              <span
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
              ></span>
            </span>
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {RECENT_EPISODES.map((ep) => (
            <article
              key={ep.slug}
              className="group flex flex-col overflow-hidden rounded-3xl border bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
            >
              <Link
                href={`/episodios/${ep.slug}`}
                className="relative block aspect-square overflow-hidden"
              >
                <img
                  src={ep.img}
                  alt={ep.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: '#f5f2ea', color: '#0c1f36' }}
                >
                  EP {ep.ep}
                </span>
                <span
                  aria-label="Reproducir"
                  className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4l14 8-14 8V4z"></path>
                  </svg>
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-7">
                <div className="text-xs uppercase tracking-[0.18em]" style={{ color: '#687680' }}>
                  {ep.tags} · {ep.time}
                </div>
                <h3 className="mt-3 font-bold text-2xl leading-tight">
                  <Link href={`/episodios/${ep.slug}`} className="hover:underline">
                    {ep.title}
                  </Link>
                </h3>
                <p
                  className="mt-3 flex-1 text-sm leading-relaxed"
                  style={{ color: 'rgba(12, 31, 54, 0.65)' }}
                >
                  {ep.desc}
                </p>

                <div
                  className="mt-6 flex items-center justify-between border-t pt-5"
                  style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
                >
                  <Link
                    href={`/episodios/${ep.slug}`}
                    className="text-sm font-semibold hover:opacity-70"
                  >
                    Escuchar →
                  </Link>
                  <div className="flex gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: '#fee94b' }}
                    ></span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: '#0c1f36' }}
                    ></span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: '#e74c3c' }}
                    ></span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
