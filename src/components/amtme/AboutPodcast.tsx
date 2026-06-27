import { SectionLabel, ArrowIcon } from './icons';

export function AboutPodcast() {
  return (
    <section
      id="manifiesto"
      className="border-y border-navy/10 bg-cream px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel kicker="Qué es AMTME" small />
          <h2 className="mt-5 font-display text-4xl text-navy lg:text-5xl">
            Una casa
            <br />
            para los que
            <br />
            sintieron
            <br />
            <span className="underline-lime">demasiado</span>.
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-navy/80 lg:col-span-7 lg:col-start-6">
          <p>
            AMTME es un espacio para quienes han sentido demasiado, han explicado demasiado, han
            esperado demasiado y un día necesitan volver a escucharse.
          </p>
          <p className="text-navy/65">
            No viene a darte respuestas perfectas. Viene a acompañarte mientras encuentras las
            tuyas. Aquí no hablamos desde el pedestal — hablamos desde el camino, con honestidad,
            vulnerabilidad y una mirada simbólica que usa el tarot como espejo de conciencia.
          </p>
          <p className="text-navy/65">
            No prometemos arreglarte. Te recordamos que no estás roto: estás entendiendo tarde lo
            que nadie te enseñó a tiempo.
          </p>
          <div className="pt-4">
            <a
              href="#episodios"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-navy"
            >
              <span className="underline-lime">Empieza por aquí</span>
              <ArrowIcon className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
