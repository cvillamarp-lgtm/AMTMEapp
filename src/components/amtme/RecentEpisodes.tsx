import Link from "next/link";
import { episodes } from "@/data/episodes";
import { PlayIcon, SectionLabel } from "./icons";

export function RecentEpisodes() {
  return (
    <section id="episodios" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionLabel kicker="Catálogo" title="Episodios recientes." />
          <a href="#" className="text-sm font-semibold text-navy">
            <span className="underline-lime">Ver todos los episodios →</span>
          </a>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((ep) => (
            <article
              key={ep.slug}
              className="group flex flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <a href="/episodios/$slug"
                params={{ slug: ep.slug }}
                className="relative block aspect-square overflow-hidden"
              >
                <img
                  src={ep.cover} alt={ep.title}
                  width={800} height={800} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">
                  {ep.number}
                </span>
                <span
                  aria-label="Reproducir"
                  className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-lime text-navy opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <PlayIcon size={16} />
                </span>
              </a>
              <div className="flex flex-1 flex-col p-7">
                <div className="text-xs uppercase tracking-[0.18em] text-bluegray">
                  {ep.topic} · {ep.duration}
                </div>
                <h3 className="mt-3 font-display text-2xl leading-tight text-navy">
                  <a href="/episodios/$slug" params={{ slug: ep.slug }} className="hover:underline">
                    {ep.title}
                  </a>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/65">{ep.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-5">
                  <a href="/episodios/$slug" params={{ slug: ep.slug }}
                    className="text-sm font-semibold text-navy"
                  >
                    Escuchar →
                  </a>
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-lime" />
                    <span className="h-2 w-2 rounded-full bg-navy" />
                    <span className="h-2 w-2 rounded-full bg-amtme-red" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
