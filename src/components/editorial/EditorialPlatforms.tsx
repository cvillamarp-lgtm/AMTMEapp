'use client';

import { BRAND } from '@/lib/constants';

interface Platform {
  name: string;
  sub: string;
  url: string;
}

const PLATFORMS: Platform[] = [
  { name: 'Spotify', sub: 'Principal', url: BRAND.spotifyUrl },
  { name: 'Apple Podcasts', sub: 'iOS', url: BRAND.applePodcastsUrl },
  { name: 'iVoox', sub: 'Comunidad ES', url: BRAND.ivooxUrl },
  { name: 'Instagram', sub: 'Comunidad', url: BRAND.podcastInstagram },
];

export function EditorialPlatforms() {
  return (
    <section
      className="border-t px-6 py-20 lg:px-12"
      style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
    >
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
              Plataformas
            </div>
            <h2 className="mt-5 font-bold text-3xl lg:text-4xl">Escucha donde quieras.</h2>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-soft"
              style={{ borderColor: 'rgba(12, 31, 54, 0.15)' }}
            >
              <div>
                <div className="font-bold text-lg" style={{ color: '#0c1f36' }}>
                  {p.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#687680' }}>
                  {p.sub}
                </div>
              </div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all group-hover:translate-x-1"
                style={{ color: 'rgba(12, 31, 54, 0.4)' }}
              >
                <path d="M5 12h14M13 5l7 7-7 7"></path>
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
