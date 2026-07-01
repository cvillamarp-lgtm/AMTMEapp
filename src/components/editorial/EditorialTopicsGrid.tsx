const TOPICS = [
  'Amor vs apego',
  'Límites',
  'Dignidad',
  'Rechazo',
  'Duelo',
  'Ansiedad emocional',
  'Rol del salvador',
  'Volver a uno mismo',
  'Tarot como espejo',
];

export function EditorialTopicsGrid() {
  return (
    <section className="px-6 py-24 lg:px-12" aria-labelledby="topics-title">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]" style={{ color: '#687680' }}>
              <span className="h-px w-8" style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }} />
              Temas
            </div>
            <h2 id="topics-title" className="mt-5 font-display text-4xl leading-none lg:text-6xl" style={{ color: '#0c1f36' }}>
              Lo que abordamos
            </h2>
          </div>
          <span className="text-sm" style={{ color: '#687680' }}>
            {String(TOPICS.length).padStart(2, '0')} territorios emocionales
          </span>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {TOPICS.map((tema, i) => (
            <span key={tema} className="tag-chip group">
              <span className="mr-3 transition-colors group-hover:text-[#0c1f36]" style={{ color: '#687680' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {tema}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
