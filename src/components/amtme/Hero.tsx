import { PlayIcon } from './icons';

const heroImg = '/amtme-editorial/christian-hero.jpg';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-navy/10">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-20 pt-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="lg:col-span-7">
          <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-bluegray">
            <span className="h-px w-10 bg-navy/30" />
            Episodio 014 · Nuevo
          </div>
          <h1 className="font-display text-[clamp(2.4rem,7vw,6.8rem)] text-navy">
            A mí tampoco me explicaron <span className="underline-lime">cómo se suelta</span> lo que
            todavía duele.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-navy/75">
            Un podcast para entender el amor, el apego, los vínculos, la dignidad y todo eso que
            sentimos, pero que nadie nos enseñó a nombrar.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/#featured"
              className="inline-flex items-center gap-3 rounded-full bg-lime px-7 py-4 text-sm font-bold text-navy shadow-soft transition-transform hover:-translate-y-[2px]"
            >
              <PlayIcon /> Escuchar episodio destacado
            </a>
            <a
              href="/#episodios"
              className="inline-flex items-center gap-2 rounded-full border border-navy px-7 py-4 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-cream"
            >
              Ver episodios
            </a>
          </div>
          <dl className="mt-16 grid max-w-md grid-cols-3 gap-6 border-t border-navy/10 pt-8 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-bluegray">Temporadas</dt>
              <dd className="mt-1 font-display text-2xl">03</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-bluegray">Episodios</dt>
              <dd className="mt-1 font-display text-2xl">42</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-bluegray">Oyentes</dt>
              <dd className="mt-1 font-display text-2xl">120K+</dd>
            </div>
          </dl>
        </div>
        <div className="relative lg:col-span-5">
          <div className="absolute -left-6 top-12 z-0 hidden h-72 w-72 rounded-full bg-lime/70 blur-[2px] lg:block" />
          <div className="relative z-10 overflow-hidden rounded-3xl border border-navy/10 bg-card shadow-soft">
            <img
              src={heroImg}
              alt="Christian Villamar, host de A Mí Tampoco Me Explicaron"
              width={1080}
              height={1600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 z-20 hidden rounded-2xl bg-navy px-5 py-4 text-cream shadow-card-hover md:block">
            <div className="text-[10px] uppercase tracking-[0.2em] text-lime">Host</div>
            <div className="mt-1 font-display text-lg">Christian Villamar</div>
          </div>
        </div>
      </div>
      <Marquee />
    </section>
  );
}

function Marquee() {
  const items = [
    'Amor vs apego',
    'Dignidad',
    'Volver a uno mismo',
    'Duelo emocional',
    'Límites',
    'Rechazo',
    'Ansiedad afectiva',
    'Tarot como espejo',
  ];
  return (
    <div className="overflow-hidden border-t border-navy/10 bg-navy text-cream">
      <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap py-5">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="mx-10 font-display text-2xl tracking-wide">
            {t}
            <span className="ml-10 text-lime">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}`}</style>
    </div>
  );
}
