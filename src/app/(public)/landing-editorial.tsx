'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function LandingEditorial() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f2ea', color: '#0c1f36' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          borderColor: 'rgba(12, 31, 54, 0.1)',
          backgroundColor: 'rgba(245, 242, 234, 0.85)',
        }}
      >
        <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight" style={{ color: '#0c1f36' }}>
              AMTME
            </span>
            <span
              className="hidden text-[10px] uppercase tracking-[0.2em]"
              style={{ color: '#687680 ' }}
            >
              podcast
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <button
              onClick={() => scrollToSection('featured')}
              className="relative py-2 hover:opacity-70"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('episodios')}
              className="relative py-2 hover:opacity-70"
            >
              Episodios
            </button>
            <button
              onClick={() => scrollToSection('manifiesto')}
              className="relative py-2 hover:opacity-70"
            >
              Sobre AMTME
            </button>
            <button
              onClick={() => scrollToSection('christian')}
              className="relative py-2 hover:opacity-70"
            >
              Christian
            </button>
            <button
              onClick={() => scrollToSection('newsletter')}
              className="relative py-2 hover:opacity-70"
            >
              Newsletter
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="hidden text-xs font-semibold opacity-70 hover:opacity-100 md:inline"
              style={{ color: '#0c1f36' }}
            >
              Studio
            </Link>
            <button
              onClick={() => scrollToSection('featured')}
              className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-[2px]"
              style={{ backgroundColor: '#0c1f36', color: '#f5f2ea' }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: '#fee94b' }}
              ></span>
              Escuchar ahora
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-full border md:hidden"
              style={{ borderColor: 'rgba(12, 31, 54, 0.15)', color: '#0c1f36' }}
            >
              {mobileMenuOpen ? <X width={22} /> : <Menu width={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav
            className="border-t md:hidden"
            style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
          >
            <div className="space-y-3 px-6 py-4">
              <button
                onClick={() => scrollToSection('featured')}
                className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection('episodios')}
                className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
              >
                Episodios
              </button>
              <button
                onClick={() => scrollToSection('manifiesto')}
                className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
              >
                Sobre AMTME
              </button>
              <button
                onClick={() => scrollToSection('christian')}
                className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
              >
                Christian
              </button>
              <button
                onClick={() => scrollToSection('newsletter')}
                className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
              >
                Newsletter
              </button>
              <Link
                href="/studio"
                className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
              >
                Studio
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main>
        {/* Hero */}
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
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}
                ></span>
                Episodio 014 · Nuevo
              </div>
              <h1
                className="font-bold text-[clamp(2.4rem,7vw,6.8rem)] leading-[1.05]"
                style={{ color: '#0c1f36' }}
              >
                A mí tampoco me explicaron{' '}
                <span className="relative inline-block">
                  cómo se suelta
                  <span
                    className="absolute bottom-1 left-0 right-0 h-3"
                    style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
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
                  onClick={() => scrollToSection('featured')}
                  className="inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-black transition-transform hover:-translate-y-[2px] shadow-soft"
                  style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4l14 8-14 8V4z"></path>
                  </svg>
                  Escuchar episodio destacado
                </button>
                <button
                  onClick={() => scrollToSection('episodios')}
                  className="inline-flex items-center gap-2 rounded-full border-2 px-7 py-4 text-sm font-black transition-colors hover:text-white"
                  style={{ borderColor: '#0c1f36', color: '#0c1f36' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0c1f36';
                    e.currentTarget.style.color = '#f5f2ea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0c1f36';
                  }}
                >
                  Ver episodios
                </button>
              </div>

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
                <div
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: '#fee94b' }}
                >
                  Host
                </div>
                <div className="mt-1 font-bold text-lg">Christian Villamar</div>
              </div>
            </div>
          </div>

          {/* Marquee */}
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

        {/* Featured Episode */}
        <section id="featured" className="px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <div>
              <div
                className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
                style={{ color: '#687680' }}
              >
                <span
                  className="h-px w-8"
                  style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}
                ></span>
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
                    llamarte a la puerta. Un episodio sobre el ciclo, el cuerpo y lo que realmente
                    se está soltando cuando crees que estás soltando.
                  </p>
                </div>

                <div className="space-y-6">
                  <div
                    className="overflow-hidden rounded-2xl border"
                    style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: 'white' }}
                  >
                    <iframe
                      title="Spotify Player"
                      src="https://open.spotify.com/embed/episode/PLACEHOLDER?utm_source=generator"
                      width="100%"
                      height="152"
                      frameBorder="0"
                      loading="lazy"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    ></iframe>
                  </div>

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
                        href="https://open.spotify.com/"
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
                        href="https://podcasts.apple.com/"
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
                        href="https://www.ivoox.com/"
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

        {/* Manifiesto Section */}
        <section
          id="manifiesto"
          className="border-y px-6 py-24 lg:px-12 lg:py-32"
          style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
        >
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div>
                <div
                  className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
                  style={{ color: '#687680' }}
                >
                  <span
                    className="h-px w-8"
                    style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}
                  ></span>
                  Qué es AMTME
                </div>
              </div>
              <h2 className="mt-5 font-bold text-4xl leading-tight lg:text-5xl">
                Una casa para los que sintieron{' '}
                <span className="relative inline-block">
                  demasiado
                  <span
                    className="absolute bottom-1 left-0 right-0 h-3"
                    style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
                  ></span>
                </span>
                .
              </h2>
            </div>

            <div
              className="space-y-6 text-lg leading-relaxed lg:col-span-7 lg:col-start-6"
              style={{ color: 'rgba(12, 31, 54, 0.8)' }}
            >
              <p>
                AMTME es un espacio para quienes han sentido demasiado, han explicado demasiado, han
                esperado demasiado y un día necesitan volver a escucharse.
              </p>
              <p style={{ color: 'rgba(12, 31, 54, 0.65)' }}>
                No viene a darte respuestas perfectas. Viene a acompañarte mientras encuentras las
                tuyas. Aquí no hablamos desde el pedestal — hablamos desde el camino, con
                honestidad, vulnerabilidad y una mirada simbólica que usa el tarot como espejo de
                conciencia.
              </p>
              <p style={{ color: 'rgba(12, 31, 54, 0.65)' }}>
                No prometemos arreglarte. Te recordamos que no estás roto: estás entendiendo tarde
                lo que nadie te enseñó a tiempo.
              </p>
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section className="px-6 py-24 lg:px-12">
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
                  Temas
                </div>
                <h2 className="mt-5 font-bold text-4xl lg:text-6xl">Lo que abordamos.</h2>
              </div>
              <span className="text-sm" style={{ color: '#687680' }}>
                09 territorios emocionales
              </span>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {[
                'Amor vs apego',
                'Límites',
                'Dignidad',
                'Rechazo',
                'Duelo',
                'Ansiedad emocional',
                'Rol del salvador',
                'Volver a uno mismo',
                'Tarot como espejo',
              ].map((tema, i) => (
                <button
                  key={i}
                  type="button"
                  className="rounded-full border bg-white px-6 py-3 text-sm font-medium transition-colors hover:text-white"
                  style={{
                    borderColor: 'rgba(12, 31, 54, 0.2)',
                    color: '#0c1f36',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0c1f36';
                    e.currentTarget.style.color = '#f5f2ea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#0c1f36';
                  }}
                >
                  <span style={{ color: '#687680' }} className="mr-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {tema}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Episodes */}
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
              {[
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
              ].map((ep) => (
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
                    <div
                      className="text-xs uppercase tracking-[0.18em]"
                      style={{ color: '#687680' }}
                    >
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

        {/* Manifesto Navy */}
        <section
          className="relative overflow-hidden px-6 py-32 text-white lg:px-12 lg:py-44"
          style={{ backgroundColor: '#0c1f36' }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          ></div>

          <div className="relative mx-auto max-w-[1100px] text-center">
            <div
              className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em]"
              style={{ color: '#fee94b' }}
            >
              <span className="h-px w-8" style={{ backgroundColor: '#fee94b' }}></span>
              Manifiesto
            </div>
            <p className="font-bold text-[clamp(2rem,5.2vw,5rem)] leading-[1.02]">
              No era intensidad.
              <br />
              Era una{' '}
              <span className="relative inline-block">
                herida intentando
                <span
                  className="absolute bottom-1 left-0 right-0 h-3"
                  style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
                ></span>
              </span>
              <br />
              explicar por qué dolía tanto.
            </p>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('featured')}
                className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold transition-transform hover:-translate-y-[2px]"
                style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4l14 8-14 8V4z"></path>
                </svg>
                Escuchar el podcast
              </button>
              <button
                onClick={() => scrollToSection('newsletter')}
                className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold transition-colors hover:bg-white hover:text-navy"
                style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}
              >
                Unirme a la newsletter
              </button>
            </div>
          </div>
        </section>

        {/* About Christian */}
        <section id="christian" className="px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div
                className="overflow-hidden rounded-3xl border"
                style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
              >
                <img
                  src="/christian-back.jpg"
                  alt="Christian Villamar de espaldas"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7">
              <div>
                <div
                  className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
                  style={{ color: '#687680' }}
                >
                  <span
                    className="h-px w-8"
                    style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}
                  ></span>
                  Sobre Christian
                </div>
              </div>
              <h2 className="mt-5 font-bold text-4xl leading-[0.95] lg:text-6xl">
                No hablo desde el pedestal. Hablo desde el camino.
              </h2>
              <div
                className="mt-8 space-y-5 text-lg leading-relaxed"
                style={{ color: 'rgba(12, 31, 54, 0.75)' }}
              >
                <p>
                  Soy Christian Villamar. AMTME nace de todo eso que también tuve que aprender
                  tarde: amar sin desaparecer, soltar sin romperme y volver a mí sin pedir permiso.
                </p>
                <p style={{ color: 'rgba(12, 31, 54, 0.6)' }}>
                  Llevo años conversando sobre vínculos, apego, ansiedad afectiva y dignidad
                  emocional. No para darte fórmulas — para acompañarte mientras entiendes las tuyas.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-[2px]"
                  style={{ backgroundColor: '#0c1f36' }}
                >
                  Conocer más
                </a>
                <a
                  href="https://instagram.com/YOSOYVILLAMAR"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:text-white"
                  style={{ borderColor: 'rgba(12, 31, 54, 0.3)', color: '#0c1f36' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0c1f36';
                    e.currentTarget.style.color = '#f5f2ea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0c1f36';
                  }}
                >
                  @YOSOYVILLAMAR
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section id="newsletter" className="px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1320px]">
            <div
              className="grid grid-cols-1 overflow-hidden rounded-[2rem] lg:grid-cols-12"
              style={{ backgroundColor: '#fee94b' }}
            >
              <div className="p-10 lg:col-span-7 lg:p-16">
                <div
                  className="text-xs uppercase tracking-[0.25em]"
                  style={{ color: 'rgba(12, 31, 54, 0.6)' }}
                >
                  Carta emocional
                </div>
                <h2
                  className="mt-4 font-bold text-4xl leading-[0.95] lg:text-6xl"
                  style={{ color: '#0c1f36' }}
                >
                  Recibe una carta cuando haya algo que valga la pena decir.
                </h2>
                <p className="mt-6 max-w-xl text-lg" style={{ color: 'rgba(12, 31, 54, 0.75)' }}>
                  Reflexiones, episodios nuevos y recordatorios para no volver a negociarte por
                  migajas. Sin spam. Sin ruido. Solo cuando importa.
                </p>

                <form className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    className="flex-1 rounded-full border bg-white px-6 py-4 text-navy placeholder:text-navy/40 focus:border-navy focus:outline-none"
                    style={{
                      borderColor: 'rgba(12, 31, 54, 0.2)',
                      backgroundColor: '#f5f2ea',
                      color: '#0c1f36',
                    }}
                  />
                  <button
                    type="submit"
                    className="rounded-full px-8 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-[2px]"
                    style={{ backgroundColor: '#0c1f36' }}
                  >
                    Quiero recibirla
                  </button>
                </form>
                <p className="mt-4 text-xs" style={{ color: 'rgba(12, 31, 54, 0.55)' }}>
                  Protegemos tu correo. Te puedes dar de baja cuando quieras.
                </p>
              </div>

              <div
                className="relative hidden border-l lg:col-span-5 lg:block"
                style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
              >
                <div className="flex h-full flex-col justify-between p-12">
                  <div
                    className="font-bold text-[8rem] leading-none"
                    style={{ color: 'rgba(12, 31, 54, 0.9)' }}
                  >
                    "
                  </div>
                  <div>
                    <p className="font-bold text-3xl leading-tight" style={{ color: '#0c1f36' }}>
                      Sentirse acompañado también es una forma de sanar.
                    </p>
                    <div
                      className="mt-6 text-xs uppercase tracking-[0.2em]"
                      style={{ color: 'rgba(12, 31, 54, 0.6)' }}
                    >
                      — Una oyente · México
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms */}
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

            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
              {[
                { name: 'Spotify', sub: 'Principal', url: 'https://open.spotify.com/' },
                { name: 'Apple Podcasts', sub: 'iOS', url: 'https://podcasts.apple.com/' },
                { name: 'YouTube', sub: 'Video & audio', url: 'https://youtube.com/' },
                { name: 'iVoox', sub: 'Comunidad ES', url: 'https://www.ivoox.com/' },
                { name: 'RSS', sub: 'Feed directo', url: '#' },
              ].map((p) => (
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
                    <div
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: '#687680' }}
                    >
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
      </main>

      {/* Footer */}
      <footer
        className="px-6 pb-10 pt-24 text-white lg:px-12"
        style={{ backgroundColor: '#0c1f36' }}
      >
        <div className="mx-auto max-w-[1320px]">
          <div
            className="grid grid-cols-1 gap-12 border-b pb-16 lg:grid-cols-12"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
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

            <div className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
                Navegar
              </h4>
              <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>
                  <Link href="/">Inicio</Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection('episodios')}>Episodios</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('manifiesto')}>Sobre AMTME</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('christian')}>Christian</button>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
                Escuchar
              </h4>
              <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>
                  <a href="https://open.spotify.com/" target="_blank" rel="noreferrer">
                    Spotify
                  </a>
                </li>
                <li>
                  <a href="https://podcasts.apple.com/" target="_blank" rel="noreferrer">
                    Apple Podcasts
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com/" target="_blank" rel="noreferrer">
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://www.ivoox.com/" target="_blank" rel="noreferrer">
                    iVoox
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
                Contacto
              </h4>
              <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>hola@amtme.com</li>
                <li>Prensa y colaboraciones</li>
                <li>
                  <a
                    href="https://instagram.com/YOSOYVILLAMAR"
                    target="_blank"
                    rel="noreferrer"
                    className="relative inline-block"
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
    </div>
  );
}
