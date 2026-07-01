export function EditorialAboutSection() {
  return (
    <section
      id="manifiesto"
      className="border-y px-6 py-24 lg:px-12 lg:py-32"
      style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
      aria-labelledby="about-amtme-title"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]" style={{ color: '#687680' }}>
            <span className="h-px w-8" style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }} />
            Qué es AMTME
          </div>
          <h2 id="about-amtme-title" className="mt-5 font-display text-4xl leading-none lg:text-5xl" style={{ color: '#0c1f36' }}>
            Una casa para los que sintieron <span className="underline-lime inline-block">demasiado</span>.
          </h2>
        </div>

        <div className="space-y-6 text-lg leading-relaxed lg:col-span-7 lg:col-start-6" style={{ color: 'rgba(12, 31, 54, 0.8)' }}>
          <p>
            AMTME es un espacio para quienes han sentido demasiado, han explicado demasiado, han esperado demasiado y un día necesitan volver a escucharse sin tener que justificar por qué les duele.
          </p>
          <p style={{ color: 'rgba(12, 31, 54, 0.65)' }}>
            No viene a darte respuestas perfectas. Viene a acompañarte mientras encuentras las tuyas. Aquí no hablamos desde el pedestal; hablamos desde el camino, con honestidad, vulnerabilidad y una mirada simbólica que usa el tarot como espejo de conciencia, no como predicción.
          </p>
          <div className="rounded-[2rem] border p-6 md:p-8" style={{ borderColor: 'rgba(12, 31, 54, 0.12)', backgroundColor: 'rgba(255, 255, 255, 0.45)' }}>
            <p className="font-display text-2xl leading-tight md:text-3xl" style={{ color: '#0c1f36' }}>
              No prometemos arreglarte. Te recordamos que no estás roto: estás entendiendo tarde lo que nadie te enseñó a tiempo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
