import { platforms } from "@/data/platforms";
import { SectionLabel, ArrowIcon } from "./icons";

export function PlatformLinks() {
  return (
    <section className="border-t border-navy/10 bg-cream px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionLabel kicker="Plataformas" title="Escucha donde quieras." small />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          {platforms.map((p) => (
            <a key={p.name} href={p.href} target="_blank" rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-navy/15 bg-white p-5 transition-all hover:-translate-y-1 hover:border-navy hover:shadow-soft">
              <div>
                <div className="font-display text-lg text-navy">{p.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-bluegray">{p.meta}</div>
              </div>
              <ArrowIcon className="text-navy/40 transition-all group-hover:translate-x-1 group-hover:text-navy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
