import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre AMTME | A Mí Tampoco Me Explicaron',
  description: 'Conoce a Christian Villamar y la historia detrás de A Mí Tampoco Me Explicaron.',
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <section
        className="border-b px-6 py-20 lg:px-12 lg:py-32"
        style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
      >
        <div className="mx-auto max-w-[1320px]">
          <h1 className="font-bold text-5xl lg:text-6xl" style={{ color: '#0c1f36' }}>
            Una casa para los que sintieron{' '}
            <span className="relative inline-block">
              demasiado
              <span
                className="absolute bottom-1 left-0 right-0 h-3"
                style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
              ></span>
            </span>
          </h1>
          <p
            className="mt-8 max-w-3xl text-lg leading-relaxed"
            style={{ color: 'rgba(12, 31, 54, 0.75)' }}
          >
            AMTME es un espacio para quienes han sentido demasiado, han explicado demasiado, han
            esperado demasiado y un día necesitan volver a escucharse.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12 lg:py-32" style={{ backgroundColor: '#f5f2ea' }}>
        <div className="mx-auto max-w-[1320px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-bold text-4xl" style={{ color: '#0c1f36' }}>
                Nuestra Misión
              </h2>
              <p className="mt-6 text-lg" style={{ color: 'rgba(12, 31, 54, 0.8)' }}>
                No prometemos arreglarte. Te recordamos que no estás roto: estás entendiendo tarde
                lo que nadie te enseñó a tiempo.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-4xl" style={{ color: '#0c1f36' }}>
                Temas que Abordamos
              </h2>
              <ul className="mt-6 space-y-2 text-lg" style={{ color: 'rgba(12, 31, 54, 0.75)' }}>
                {[
                  'Amor vs Apego',
                  'Límites',
                  'Dignidad',
                  'Duelo',
                  'Rechazo',
                  'Ansiedad Afectiva',
                  'Tarot como Espejo',
                ].map((tema) => (
                  <li key={tema} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: '#fee94b' }}
                    ></span>
                    {tema}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="font-bold text-4xl" style={{ color: '#0c1f36' }}>
            Christian Villamar
          </h2>
          <p className="mt-6 max-w-2xl text-lg" style={{ color: 'rgba(12, 31, 54, 0.8)' }}>
            Soy Christian Villamar. AMTME nace de todo eso que también tuve que aprender tarde: amar
            sin desaparecer, soltar sin romperme y volver a mí sin pedir permiso.
          </p>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: 'rgba(12, 31, 54, 0.75)' }}>
            Llevo años conversando sobre vínculos, apego, ansiedad afectiva y dignidad emocional. No
            para darte fórmulas — para acompañarte mientras entiendes las tuyas.
          </p>
        </div>
      </section>
    </div>
  );
}
