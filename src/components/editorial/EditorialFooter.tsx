'use client';

import Link from 'next/link';
import { BRAND } from '@/lib/constants';

interface EditorialFooterProps {
  onScrollToSection?: (sectionId: string) => void;
}

export function EditorialFooter({ onScrollToSection }: EditorialFooterProps) {
  const handleScroll = (sectionId: string) => {
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  return (
    <footer className="px-6 pb-10 pt-24 text-white lg:px-12" style={{ backgroundColor: '#0c1f36' }}>
      <div className="mx-auto max-w-[1320px]">
        <div
          className="grid grid-cols-1 gap-12 border-b pb-16 lg:grid-cols-12"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="font-bold text-3xl">AMTME</div>
            <p className="mt-6 max-w-md font-bold text-2xl leading-tight">
              Lo que pensamos,
              <br />
              lo que sentimos,
              <br />
              <span className="relative inline-block">
                pero que nadie nos explicó.
                <span
                  className="absolute bottom-1 left-0 right-0 h-3"
                  style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
                ></span>
              </span>
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
              Navegar
            </h4>
            <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li>
                <Link href="/">Inicio</Link>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('episodios')}
                  className="hover:text-white transition-colors text-left"
                >
                  Episodios
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('manifiesto')}
                  className="hover:text-white transition-colors text-left"
                >
                  Sobre AMTME
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('christian')}
                  className="hover:text-white transition-colors text-left"
                >
                  Christian
                </button>
              </li>
            </ul>
          </div>

          {/* Streaming Platforms */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
              Escuchar
            </h4>
            <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li>
                <a
                  href={BRAND.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Spotify
                </a>
              </li>
              <li>
                <a
                  href={BRAND.applePodcastsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Apple Podcasts
                </a>
              </li>
              <li>
                <a
                  href={BRAND.ivooxUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  iVoox
                </a>
              </li>
              <li>
                <a
                  href={BRAND.podcastInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
              Contacto
            </h4>
            <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li>hola@amtme.com</li>
              <li>Prensa y colaboraciones</li>
              <li>
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="relative inline-block hover:text-white transition-colors"
                >
                  <span className="relative inline-block">
                    @YOSOYVILLAMAR
                    <span
                      className="absolute bottom-0 left-0 right-0 h-2"
                      style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
                    ></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div
          className="flex flex-col items-start justify-between gap-4 pt-8 text-xs md:flex-row md:items-center"
          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
        >
          <div>© 2026 A Mí Tampoco Me Explicaron · Christian Villamar</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Aviso de privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
