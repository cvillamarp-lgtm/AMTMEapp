'use client';

export function EditorialAboutSection() {
  return (
    <section
      id="manifiesto"
      className="border-y px-6 py-24 lg:px-12 lg:py-32"
      style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div>
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
              style={{ color: '#687680' }}
            >
              <span
                className="h-px w-8"
                style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}
              ></span>
              Qué es AMTME
            </div>
          </div>
          <h2 className="mt-5 font-bold text-4xl leading-tight lg:text-5xl">
            Una casa para los que sintieron{' '}
            <span className="relative inline-block">
              demasiado
              <span
                className="absolute bottom-1 left-0 right-0 h-3"
                style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
              ></span>
            </span>
            .
          </h2>
        </div>

        <div
          className="space-y-6 text-lg leading-relaxed lg:col-span-7 lg:col-start-6"
          style={{ color: 'rgba(12, 31, 54, 0.8)' }}
        >
          <p>
            AMTME es un espacio para quienes han sentido demasiado, han explicado demasiado, han
            esperado demasiado y un día necesitan volver a escucharse.
          </p>
          <p style={{ color: 'rgba(12, 31, 54, 0.65)' }}>
            No viene a darte respuestas perfectas. Viene a acompañarte mientras encuentras las
            tuyas. Aquí no hablamos desde el pedestal — hablamos desde el camino, con honestidad,
            vulnerabilidad y una mirada simbólica que usa el tarot como espejo de conciencia.
          </p>
          <p style={{ color: 'rgba(12, 31, 54, 0.65)' }}>
            No prometemos arreglarte. Te recordamos que no estás roto: estás entendiendo tarde lo
            que nadie te enseñó a tiempo.
          </p>
        </div>
      </div>
    </section>
  );
}
