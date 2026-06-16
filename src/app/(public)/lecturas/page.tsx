'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LecturasPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/api/email', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setFormSubmitted(true);
        e.currentTarget.reset();
        setTimeout(() => setFormSubmitted(false), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c1f36] text-white">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight hover:text-[#e8ff40] transition-colors"
        >
          AMTME
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/episodios" className="text-[#9DC4D5] hover:text-white transition-colors">
            Episodios
          </Link>
          <Link href="/lecturas" className="text-[#e8ff40] font-semibold">
            Lecturas
          </Link>
          <Link href="/sobre" className="text-[#9DC4D5] hover:text-white transition-colors">
            Sobre
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#e8ff40] text-sm font-semibold uppercase tracking-widest mb-4">
          Lectura simbólica
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 font-josefin">
          Una lectura del lugar donde estás
        </h1>
        <p className="text-[#9DC4D5] text-lg leading-relaxed max-w-2xl">
          No para que alguien te diga lo que va a pasar. Para que puedas ver con más claridad lo que
          ya está pasando.
        </p>
      </section>

      {/* QUÉ ES */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6 font-josefin">Qué es</h2>
            <ul className="space-y-3 text-[#9DC4D5]">
              <li className="flex gap-3">
                <span className="text-[#e8ff40] flex-shrink-0">→</span>
                <span>Una lectura profunda y personalizada usando el tarot</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e8ff40] flex-shrink-0">→</span>
                <span>Un espejo de tu momento actual</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e8ff40] flex-shrink-0">→</span>
                <span>Una conversación honesta sobre lo que estás viviendo</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e8ff40] flex-shrink-0">→</span>
                <span>Una forma de ordenar lo que sientes cuando no sabes cómo nombrarlo</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 font-josefin">Qué no es</h2>
            <ul className="space-y-3 text-[#9DC4D5]">
              <li className="flex gap-3">
                <span className="text-[#e0211e] flex-shrink-0">✗</span>
                <span>Predicción del futuro</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e0211e] flex-shrink-0">✗</span>
                <span>Magia</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e0211e] flex-shrink-0">✗</span>
                <span>Promesas de resultados</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#e0211e] flex-shrink-0">✗</span>
                <span>Autoayuda genérica</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-white/5 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-12 font-josefin text-center">Cómo funciona</h2>
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:border-r border-white/10 md:pr-8">
                <div className="text-[#e8ff40] text-lg font-bold mb-3">01</div>
                <h3 className="text-xl font-bold mb-3">Me escribes</h3>
                <p className="text-[#9DC4D5] text-sm leading-relaxed">
                  Completa el formulario con tu pregunta o situación actual. Sin filtros, con tus
                  palabras.
                </p>
              </div>
              <div className="md:border-r border-white/10 md:pr-8">
                <div className="text-[#e8ff40] text-lg font-bold mb-3">02</div>
                <h3 className="text-xl font-bold mb-3">Hago la lectura</h3>
                <p className="text-[#9DC4D5] text-sm leading-relaxed">
                  Trabajo con el tiraje y preparo tu lectura escrita. No es automático, es personal.
                </p>
              </div>
              <div>
                <div className="text-[#e8ff40] text-lg font-bold mb-3">03</div>
                <h3 className="text-xl font-bold mb-3">Recibes tu lectura</h3>
                <p className="text-[#9DC4D5] text-sm leading-relaxed">
                  Te envío el texto completo por email. Tienes un intercambio de seguimiento si algo
                  no quedó claro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 font-josefin">Solicitar lectura</h2>

        {formSubmitted && (
          <div className="mb-8 bg-[#e8ff40]/10 border border-[#e8ff40]/30 rounded-2xl p-6 text-center">
            <p className="text-[#e8ff40] font-semibold">
              ✓ Solicitud enviada correctamente. Te responderé personalmente en menos de 24 horas.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Nombre</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Tu nombre"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              ¿Qué está pasando en tu vida ahora?
            </label>
            <textarea
              name="situation"
              required
              placeholder="Describe brevemente tu situación, tu contexto, lo que está pasando ahora mismo..."
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tu pregunta o consulta</label>
            <textarea
              name="question"
              placeholder="¿Qué específicamente quieres entender o aclarar? (Puede ser una pregunta concreta o una solicitud de lectura general)"
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Método de pago preferido</label>
            <select
              name="payment_method"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#e8ff40]"
            >
              <option value="transferencia">Transferencia bancaria</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Tarjeta de crédito</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <input type="hidden" name="type" value="lectura-tarot" />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
            <Link
              href="/"
              className="border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>

          <p className="text-[#9DC4D5] text-xs text-center">
            Te responderé personalmente con los detalles de pago en menos de 24 horas.
          </p>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center text-[#9DC4D5] text-sm">
          <p>© 2026 A Mí Tampoco Me Explicaron · Hecho con claridad y sin certezas vacías</p>
        </div>
      </footer>
    </div>
  );
}
