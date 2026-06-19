'use client';

import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Wire to your real newsletter provider (Mailchimp, ConvertKit, Beehiiv, etc.)
    setSubmitted(true);
  }

  return (
    <section id="newsletter" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-lime lg:grid-cols-12">
          <div className="p-10 lg:col-span-7 lg:p-16">
            <div className="text-xs uppercase tracking-[0.25em] text-navy/60">Carta emocional</div>
            <h2 className="mt-4 font-display text-4xl leading-[0.95] text-navy lg:text-6xl">
              Recibe una carta cuando haya algo que valga la pena decir.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-navy/75">
              Reflexiones, episodios nuevos y recordatorios para no volver a negociarte por migajas.
              Sin spam. Sin ruido. Solo cuando importa.
            </p>

            {submitted ? (
              <div className="mt-10 rounded-2xl border border-navy/20 bg-cream px-6 py-5 text-navy">
                Listo. Te escribiré cuando haya algo que valga la pena decir.
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="flex-1 rounded-full border border-navy/20 bg-cream px-6 py-4 text-navy placeholder:text-navy/40 focus:border-navy focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-navy px-8 py-4 text-sm font-bold text-cream transition-transform hover:-translate-y-[2px]"
                >
                  Quiero recibirla
                </button>
              </form>
            )}
            <p className="mt-4 text-xs text-navy/55">
              Protegemos tu correo. Te puedes dar de baja cuando quieras.
            </p>
          </div>
          <div className="relative hidden border-l border-navy/10 lg:col-span-5 lg:block">
            <div className="flex h-full flex-col justify-between p-12">
              <div className="font-display text-[8rem] leading-none text-navy/90">“</div>
              <div>
                <p className="font-display text-3xl leading-tight text-navy">
                  Sentirse acompañado
                  <br /> también es una forma
                  <br /> de sanar.
                </p>
                <div className="mt-6 text-xs uppercase tracking-[0.2em] text-navy/60">
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
