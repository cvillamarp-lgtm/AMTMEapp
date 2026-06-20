import { topics } from "@/data/topics";
import { SectionLabel } from "./icons";

export function TopicsGrid() {
  return (
    <section className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionLabel kicker="Temas" title="Lo que abordamos." />
          <span className="text-sm text-bluegray">
            {String(topics.length).padStart(2, "0")} territorios emocionales
          </span>
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          {topics.map((t, i) => (
            <button key={t} type="button" className="tag-chip">
              <span className="mr-2 text-bluegray">{String(i + 1).padStart(2, "0")}</span>
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
