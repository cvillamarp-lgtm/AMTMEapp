import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export function EditorialAboutChristian() {
  return (
    <section id="christian" className="px-6 py-24 lg:px-12 lg:py-32" aria-labelledby="christian-title">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div className="overflow-hidden rounded-[2rem] border shadow-soft" style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}>
            <img
              src="/images/christian-back.jpg"
              alt="Christian Villamar, imagen editorial de AMTME"
              className="aspect-[4/5] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]" style={{ color: '#687680' }}>
            <span className="h-px w-8" style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }} />
            Sobre Christian
          </div>

          <h2 id="christian-title" className="mt-5 font-display text-4xl leading-[0.95] lg:text-6xl" style={{ color: '#0c1f36' }}>
            No hablo desde el pedestal. Hablo desde el camino.
          </h2>

          <div className="mt-8 space-y-5 text-lg leading-relaxed" style={{ color: 'rgba(12, 31, 54, 0.75)' }}>
            <p>
              Soy Christian Villamar. AMTME nace de todo eso que también tuve que aprender tarde: amar sin desaparecer, soltar sin romperme y volver a mí sin pedir permiso.
            </p>
            <p style={{ color: 'rgba(12, 31, 54, 0.6)' }}>
              Llevo años conversando sobre vínculos, apego, ansiedad afectiva y dignidad emocional. No para darte fórmulas, sino para acompañarte mientras entiendes las tuyas.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#manifiesto"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-[2px]"
              style={{ backgroundColor: '#0c1f36', color: '#f5f2ea' }}
            >
              Leer manifiesto
            </Link>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#0c1f36] hover:text-[#f5f2ea]"
              style={{ borderColor: 'rgba(12, 31, 54, 0.3)', color: '#0c1f36' }}
            >
              {BRAND.handle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
