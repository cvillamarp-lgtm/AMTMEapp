'use client';

import { useState } from 'react';

interface EditorialNewsletterProps {
  onSubmit?: (email: string) => void | Promise<void>;
}

export function EditorialNewsletter({ onSubmit }: EditorialNewsletterProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div
          className="grid grid-cols-1 overflow-hidden rounded-[2rem] lg:grid-cols-12"
          style={{ backgroundColor: '#fee94b' }}
        >
          {/* Form Section */}
          <div className="p-10 lg:col-span-7 lg:p-16">
            <div
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: 'rgba(12, 31, 54, 0.6)' }}
            >
              Carta emocional
            </div>
            <h2
              className="mt-4 font-bold text-4xl leading-[0.95] lg:text-6xl"
              style={{ color: '#0c1f36' }}
            >
              Recibe una carta cuando haya algo que valga la pena decir.
            </h2>
            <p className="mt-6 max-w-xl text-lg" style={{ color: 'rgba(12, 31, 54, 0.75)' }}>
              Reflexiones, episodios nuevos y recordatorios para no volver a negociarte por migajas.
              Sin spam. Sin ruido. Solo cuando importa.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="flex-1 rounded-full border bg-white px-6 py-4 text-navy placeholder:text-navy/40 focus:border-navy focus:outline-none"
                style={{
                  borderColor: 'rgba(12, 31, 54, 0.2)',
                  backgroundColor: '#f5f2ea',
                  color: '#0c1f36',
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full px-8 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-[2px] disabled:opacity-70"
                style={{ backgroundColor: '#0c1f36' }}
              >
                {isLoading ? 'Enviando...' : 'Quiero recibirla'}
              </button>
            </form>
            <p className="mt-4 text-xs" style={{ color: 'rgba(12, 31, 54, 0.55)' }}>
              Protegemos tu correo. Te puedes dar de baja cuando quieras.
            </p>
          </div>

          {/* Testimonial Section */}
          <div
            className="relative hidden border-l lg:col-span-5 lg:block"
            style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
          >
            <div className="flex h-full flex-col justify-between p-12">
              <div
                className="font-bold text-[8rem] leading-none"
                style={{ color: 'rgba(12, 31, 54, 0.9)' }}
              >
                "
              </div>
              <div>
                <p className="font-bold text-3xl leading-tight" style={{ color: '#0c1f36' }}>
                  Sentirse acompañado también es una forma de sanar.
                </p>
                <div
                  className="mt-6 text-xs uppercase tracking-[0.2em]"
                  style={{ color: 'rgba(12, 31, 54, 0.6)' }}
                >
                  — Una oyente · México
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
