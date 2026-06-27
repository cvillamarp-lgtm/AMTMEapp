'use client';

import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export function EditorialFeaturedEpisode() {
  return (
    <section id="featured" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div>
          <div
            className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
            style={{ color: '#687680' }}
          >
            <span className="h-px w-8" style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}></span>
            Episodio destacado
          </div>
          <h2 className="mt-5 font-bold text-4xl lg:text-6xl">Lo que está sonando ahora</h2>
        </div>

        <div
          className="mt-12 grid grid-cols-1 overflow-hidden rounded-3xl text-white lg:grid-cols-12"
          style={{ backgroundColor: '#111111' }}
        >
          <div className="relative lg:col-span-5">
            <img
              src="/episode-cover-1.jpg"
              alt="Por qué vuelves aunque ya lo sabes"
              className="aspect-square h-full w-full object-cover"
            />
            <div
              className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: '#0c1f36' }}
              ></span>
              NUEVO · EP 014
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 p-8 lg:col-span-7 lg:p-12">
            <div>
              <div className="text-xs uppercase tracking-[0.25em]" style={{ color: '#687680' }}>
                Apego · Dignidad · 48 min
              </div>
              <h3 className="mt-4 font-bold text-4xl lg:text-6xl">
                Por qué vuelves aunque ya lo sabes
              </h3>
              <p className="mt-6 max-w-xl" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Esa cosa rara donde la mente entiende, el cuerpo recuerda y la historia vuelve a
                llamarte a la puerta. Un episodio sobre el ciclo, el cuerpo y lo que realmente se
                está soltando cuando crees que estás soltando.
              </p>
            </div>

            <div className="space-y-6">
              {/* Spotify Embed */}
              <div
                className="overflow-hidden rounded-2xl border"
                style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: 'white' }}
              >
                <iframe
                  title="Spotify Player"
                  src={BRAND.spotifyEmbedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  loading="lazy"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                ></iframe>
              </div>

              {/* Links Section */}
              <div
                className="flex flex-wrap items-center justify-between gap-4 border-t pt-6"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Link
                  href="/episodios/por-que-vuelves-aunque-ya-lo-sabes"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold hover:opacity-90"
                  style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
                >
                  Ver episodio completo →
                </Link>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={BRAND.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:border-yellow-300 hover:text-yellow-300"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Spotify
                  </a>
                  <a
                    href={BRAND.applePodcastsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:border-yellow-300 hover:text-yellow-300"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Apple Podcasts
                  </a>
                  <a
                    href="https://youtube.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:border-yellow-300 hover:text-yellow-300"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    YouTube
                  </a>
                  <a
                    href={BRAND.ivooxUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:border-yellow-300 hover:text-yellow-300"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    iVoox
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
