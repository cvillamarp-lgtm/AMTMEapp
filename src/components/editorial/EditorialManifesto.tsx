'use client';

interface EditorialManifestoProps {
  onListenClick?: () => void;
  onNewsletterClick?: () => void;
}

export function EditorialManifesto({ onListenClick, onNewsletterClick }: EditorialManifestoProps) {
  return (
    <section
      className="relative overflow-hidden px-6 py-32 text-white lg:px-12 lg:py-44"
      style={{ backgroundColor: '#0c1f36' }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      <div className="relative mx-auto max-w-[1100px] text-center">
        <div
          className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em]"
          style={{ color: '#fee94b' }}
        >
          <span className="h-px w-8" style={{ backgroundColor: '#fee94b' }}></span>
          Manifiesto
        </div>

        <p className="font-bold text-[clamp(2rem,5.2vw,5rem)] leading-[1.02]">
          No era intensidad.
          <br />
          Era una{' '}
          <span className="relative inline-block">
            herida intentando
            <span
              className="absolute bottom-1 left-0 right-0 h-3"
              style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
            ></span>
          </span>
          <br />
          explicar por qué dolía tanto.
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onListenClick}
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold transition-transform hover:-translate-y-[2px]"
            style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8V4z"></path>
            </svg>
            Escuchar el podcast
          </button>
          <button
            onClick={onNewsletterClick}
            className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold transition-colors hover:bg-white hover:text-navy"
            style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}
          >
            Unirme a la newsletter
          </button>
        </div>
      </div>
    </section>
  );
}
