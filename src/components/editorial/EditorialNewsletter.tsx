import { BRAND } from '@/lib/constants';

export function EditorialNewsletter() {
  return (
    <section id="newsletter" className="px-6 py-24 lg:px-12 lg:py-32" aria-labelledby="newsletter-title">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] lg:grid-cols-12" style={{ backgroundColor: '#fee94b' }}>
          <div className="p-10 lg:col-span-7 lg:p-16">
            <div className="text-xs uppercase tracking-[0.25em]" style={{ color: 'rgba(12, 31, 54, 0.6)' }}>
              Carta emocional
            </div>
            <h2 id="newsletter-title" className="mt-4 font-display text-4xl leading-[0.95] lg:text-6xl" style={{ color: '#0c1f36' }}>
              Recibe lo que valga la pena decir.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: 'rgba(12, 31, 54, 0.75)' }}>
              La carta editorial de AMTME será para reflexiones, episodios nuevos y recordatorios para no volver a negociarte por migajas. Sin spam. Sin ruido.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={BRAND.podcastInstagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold transition-transform hover:-translate-y-[2px]"
                style={{ backgroundColor: '#0c1f36', color: '#f5f2ea' }}
              >
                Unirme en Instagram
              </a>
              <a
                href={BRAND.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border px-8 py-4 text-sm font-bold transition-colors hover:bg-[#f5f2ea]"
                style={{ borderColor: 'rgba(12, 31, 54, 0.25)', color: '#0c1f36' }}
              >
                Seguir en Spotify
              </a>
            </div>
            <p className="mt-4 text-xs" style={{ color: 'rgba(12, 31, 54, 0.55)' }}>
              La suscripción por correo queda preparada visualmente, sin simular una captura que todavía no esté conectada.
            </p>
          </div>

          <div className="relative hidden border-l lg:col-span-5 lg:block" style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}>
            <div className="flex h-full flex-col justify-between p-12">
              <div className="font-display text-[8rem] leading-none" style={{ color: 'rgba(12, 31, 54, 0.9)' }}>
                “
              </div>
              <div>
                <p className="font-display text-3xl leading-tight" style={{ color: '#0c1f36' }}>
                  Sentirse acompañado también es una forma de sanar.
                </p>
                <div className="mt-6 text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(12, 31, 54, 0.6)' }}>
                  — AMTME · Comunidad
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
