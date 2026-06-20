import { BRAND } from "@/lib/constants";
import { SectionLabel } from "./icons";

export function AboutHost() {
  return (
    <section id="christian" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div className="overflow-hidden rounded-3xl border border-navy/10 shadow-soft">
            <img src="/images/christian-back.jpg" alt={`${BRAND.host} de espaldas`}
              width={1200} height={1400} loading="lazy"
              className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-7">
          <SectionLabel kicker="Sobre Christian" small />
          <h2 className="mt-5 font-display text-4xl leading-[0.95] text-navy lg:text-6xl">
            No hablo desde el<br /> pedestal. Hablo<br /> desde el camino.
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-navy/75">
            <p>
              Soy {BRAND.host}. AMTME nace de todo eso que también tuve que aprender
              tarde: amar sin desaparecer, soltar sin romperme y volver a mí sin pedir permiso.
            </p>
            <p className="text-navy/60">
              Llevo años conversando sobre vínculos, apego, ansiedad afectiva y
              dignidad emocional. No para darte fórmulas — para acompañarte mientras
              entiendes las tuyas.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#" className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-[2px]">
              Conocer más
            </a>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-navy/30 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-cream">
              {BRAND.handle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
