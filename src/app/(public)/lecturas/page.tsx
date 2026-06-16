'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '@/components/public/PublicNav';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Section } from '@/components/public/Section';

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
      <PublicNav activeRoute="/lecturas" />

      {/* HERO — Editorial */}
      <section className="pt-32 pb-24 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e8ff40] mb-6">
              Lectura personalizada
            </p>
            <h1 className="text-5xl md:text-6xl font-josefin font-bold leading-tight mb-8">
              Una lectura del lugar donde estás
            </h1>
          </div>

          <p className="text-lg text-[#9DC4D5] leading-relaxed max-w-3xl mx-auto">
            No para que alguien te diga lo que va a pasar. Para que puedas ver con más claridad lo
            que ya está pasando.
          </p>
        </div>
      </section>

      {/* QUÉ ES / QUÉ NO ES */}
      <Section background="light" border="none">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-josefin font-bold">Qué es</h2>
            <ul className="space-y-4 text-[#9DC4D5] text-base leading-relaxed">
              <li className="flex gap-4">
                <span className="text-[#e8ff40] flex-shrink-0 font-bold text-lg">✓</span>
                <span>Una lectura escrita, profunda y personalizada</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#e8ff40] flex-shrink-0 font-bold text-lg">✓</span>
                <span>Un espejo simbólico de tu momento actual</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#e8ff40] flex-shrink-0 font-bold text-lg">✓</span>
                <span>Una forma de ordenar lo que sientes cuando no sabes cómo nombrarlo</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#e8ff40] flex-shrink-0 font-bold text-lg">✓</span>
                <span>Una conversación honesta con tu pregunta real</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-josefin font-bold">Qué no es</h2>
            <ul className="space-y-4 text-[#9DC4D5] text-base leading-relaxed">
              <li className="flex gap-4">
                <span className="text-[#e0211e] flex-shrink-0 font-bold text-lg">✗</span>
                <span>Predicción del futuro</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#e0211e] flex-shrink-0 font-bold text-lg">✗</span>
                <span>Magia</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#e0211e] flex-shrink-0 font-bold text-lg">✗</span>
                <span>Terapia</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#e0211e] flex-shrink-0 font-bold text-lg">✗</span>
                <span>Una promesa de resultados o sanación rápida</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* CÓMO FUNCIONA */}
      <Section background="dark" border="top">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-josefin font-bold text-center">Cómo funciona</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Me escribes',
                description:
                  'Completa el formulario con tu pregunta o situación actual. Sin filtros, con tus palabras.',
              },
              {
                step: '02',
                title: 'Hago la lectura',
                description:
                  'Trabajo con el tiraje y preparo tu lectura escrita. No es automático, es personal.',
              },
              {
                step: '03',
                title: 'Recibes tu lectura',
                description:
                  'Te envío el texto completo por email. Tienes un intercambio de seguimiento incluido.',
              },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="text-4xl font-bold text-[#e8ff40]">{item.step}</div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-[#9DC4D5] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRECIO Y DETALLES */}
      <Section background="transparent" border="top">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] text-center">
              <p className="text-3xl font-bold text-[#e8ff40] mb-2">$350</p>
              <p className="text-xs text-[#9DC4D5] font-semibold">MXN / $18 USD</p>
            </div>
            <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] text-center">
              <p className="text-3xl font-bold text-[#e8ff40] mb-2">48–72h</p>
              <p className="text-xs text-[#9DC4D5] font-semibold">Entrega escrita</p>
            </div>
            <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] text-center">
              <p className="text-3xl font-bold text-[#e8ff40] mb-2">1</p>
              <p className="text-xs text-[#9DC4D5] font-semibold">Seguimiento incluido</p>
            </div>
            <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] text-center">
              <p className="text-3xl font-bold text-[#e8ff40] mb-2">Tuya</p>
              <p className="text-xs text-[#9DC4D5] font-semibold">La pregunta</p>
            </div>
          </div>
        </div>
      </Section>

      {/* FORMULARIO */}
      <Section background="light" border="top">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-josefin font-bold mb-12 text-center">
            Solicitar tu lectura
          </h2>

          {formSubmitted && (
            <div className="mb-8 bg-[#e8ff40]/10 border border-[#e8ff40]/30 rounded-lg p-6 text-center">
              <p className="text-[#e8ff40] font-semibold">
                ✓ Solicitud enviada correctamente. Te responderé personalmente en menos de 24 horas.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Nombre</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Tu nombre"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40] focus:bg-white/15 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40] focus:bg-white/15 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                ¿Qué está pasando en tu vida ahora?
              </label>
              <textarea
                name="situation"
                required
                placeholder="Describe brevemente tu situación, tu contexto, lo que está pasando ahora mismo..."
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40] focus:bg-white/15 resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Tu pregunta o consulta
              </label>
              <textarea
                name="question"
                placeholder="¿Qué específicamente quieres entender o aclarar? (Pregunta concreta o lectura general)"
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40] focus:bg-white/15 resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Método de pago preferido
              </label>
              <select
                name="payment_method"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#e8ff40] focus:bg-white/15 transition-colors"
              >
                <option value="transferencia">Transferencia bancaria</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Tarjeta de crédito</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <input type="hidden" name="type" value="lectura-tarot" />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-4 rounded-lg hover:bg-[#d4eb3a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
              <Link
                href="/"
                className="border border-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-200 text-center font-semibold"
              >
                Cancelar
              </Link>
            </div>

            <p className="text-[#9DC4D5] text-xs text-center pt-4">
              Te responderé personalmente con los detalles de pago en menos de 24 horas.
            </p>
          </form>
        </div>
      </Section>

      {/* CITA */}
      <Section background="transparent" border="top">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-lg md:text-xl text-[#e8ff40] italic font-special-elite leading-relaxed">
            "No predigo nada. No hago magia. Uso el tarot como espejo: una forma de ordenar lo que
            tienes en la cabeza y no sabes cómo nombrar."
          </blockquote>
        </div>
      </Section>

      <PublicFooter />
    </div>
  );
}
