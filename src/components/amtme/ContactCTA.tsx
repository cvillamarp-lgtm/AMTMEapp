import { PlayIcon } from './icons';

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-navy px-6 py-32 text-cream lg:px-12 lg:py-44">
      <div className="absolute inset-0 opacity-[0.04] [background:radial-gradient(circle_at_20%_30%,white_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative mx-auto max-w-[1100px] text-center">
        <div className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-lime">
          <span className="h-px w-8 bg-lime" /> Manifiesto
        </div>
        <p className="font-display text-[clamp(2rem,5.2vw,5rem)] leading-[1.02] text-cream">
          No era intensidad.
          <br />
          Era una <span className="underline-lime !text-navy">herida intentando</span>
          <br />
          explicar por qué dolía tanto.
        </p>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#featured"
            className="inline-flex items-center gap-3 rounded-full bg-lime px-8 py-4 text-sm font-bold text-navy transition-transform hover:-translate-y-[2px]"
          >
            <PlayIcon /> Escuchar el podcast
          </a>
          <a
            href="#newsletter"
            className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-navy"
          >
            Unirme a la newsletter
          </a>
        </div>
      </div>
    </section>
  );
}
