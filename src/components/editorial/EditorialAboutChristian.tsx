'use client';

import { useState } from 'react';

export function EditorialAboutChristian() {
  const [hoveredButton, setHoveredButton] = useState<'instagram' | null>(null);

  return (
    <section id="christian" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Image - Mobile First, Then Desktop */}
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

        {/* Text Content */}
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
              Soy Christian Villamar. AMTME nace de todo eso que también tuve que aprender tarde:
              amar sin desaparecer, soltar sin romperme y volver a mí sin pedir permiso.
            </p>
            <p style={{ color: 'rgba(12, 31, 54, 0.6)' }}>
              Llevo años conversando sobre vínculos, apego, ansiedad afectiva y dignidad emocional.
              No para darte fórmulas — para acompañarte mientras entiendes las tuyas.
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
              style={{
                borderColor: 'rgba(12, 31, 54, 0.3)',
                color: hoveredButton === 'instagram' ? '#f5f2ea' : '#0c1f36',
                backgroundColor: hoveredButton === 'instagram' ? '#0c1f36' : 'transparent',
              }}
              onMouseEnter={() => setHoveredButton('instagram')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              @YOSOYVILLAMAR
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
