import Link from 'next/link';
import { PublicNav } from '@/components/public/PublicNav';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Section } from '@/components/public/Section';

const SPOTIFY_SHOW_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL || 'https://open.spotify.com/show/REEMPLAZA';

export const metadata = {
  title: 'Sobre AMTME | A Mí Tampoco Me Explicaron',
  description:
    'Conoce a Christian Villamar y la historia detrás de AMTME. Un espacio para nombrar lo que sentimos sobre amor, apego e identidad.',
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#0c1f36] text-white">
      <PublicNav activeRoute="/sobre" />

      {/* HERO — Editorial y sobrio */}
      <section className="pt-32 pb-24 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e8ff40] mb-6">
              La historia
            </p>
            <h1 className="text-5xl md:text-6xl font-josefin font-bold leading-tight mb-8">
              No te habla alguien que ya llegó
            </h1>
          </div>

          <p className="text-lg text-[#9DC4D5] leading-relaxed max-w-3xl mx-auto">
            Te habla alguien que también está aprendiendo a nombrar lo que antes solo dolía.
          </p>
        </div>
      </section>

      {/* CHRISTIAN */}
      <Section background="light" border="none">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-josefin font-bold mb-6">Christian Villamar</h2>
                <p className="text-[#9DC4D5] text-lg leading-relaxed mb-4">
                  Creador de AMTME. Hospedera de conversaciones profundas. Practicante de tarot
                  simbólico. Alguien que aprendió tarde a nombrar lo que sentía.
                </p>
                <p className="text-[#9DC4D5] text-lg leading-relaxed mb-4">
                  Durante años guardé silencio sobre los patrones que repetía, las relaciones que
                  elegía, la identidad que construía. Cuando empecé a observar, a nombrar, a
                  entender — algo cambió.
                </p>
                <p className="text-[#9DC4D5] text-lg leading-relaxed">
                  AMTME nació de esa pregunta: ¿qué hacemos con todo lo que sentimos pero que nadie
                  nos enseñó a entender?
                </p>
              </div>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-xl p-8 h-fit">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#e8ff40] mb-2">34+</p>
                  <p className="text-sm text-[#9DC4D5] font-semibold">episodios publicados</p>
                </div>
                <div className="border-t border-white/10 pt-6 text-center">
                  <p className="text-4xl font-bold text-[#e8ff40] mb-2">15+</p>
                  <p className="text-sm text-[#9DC4D5] font-semibold">países de escuchas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* QUÉ ES / QUÉ NO ES */}
      <Section background="dark" border="top">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-josefin font-bold mb-12 text-center">
            Qué es AMTME
          </h2>

          <div className="space-y-10 mb-12">
            <p className="text-lg text-[#9DC4D5] leading-relaxed text-center">
              A Mí Tampoco Me Explicaron nació porque nadie nos enseñó qué hacer cuando el amor
              duele, cuando un vínculo te confunde o cuando no reconoces la persona en la que te has
              convertido.
            </p>
            <p className="text-lg text-[#9DC4D5] leading-relaxed text-center">
              Este es el espacio que hubiera querido encontrar cuando más lo necesitaba. No para que
              alguien te diga qué hacer. Para que puedas por fin nombrarlo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Qué sí es</h3>
              <ul className="space-y-4 text-[#9DC4D5] text-base leading-relaxed">
                <li className="flex gap-4">
                  <span className="text-[#e8ff40] flex-shrink-0 font-bold text-lg">✓</span>
                  <span>Un refugio simbólico</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#e8ff40] flex-shrink-0 font-bold text-lg">✓</span>
                  <span>Una conversación honesta</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#e8ff40] flex-shrink-0 font-bold text-lg">✓</span>
                  <span>Una forma de nombrar lo que antes dolía en silencio</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#e8ff40] flex-shrink-0 font-bold text-lg">✓</span>
                  <span>Episodios sobre amor, apego, identidad, límites, duelo</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Qué no es</h3>
              <ul className="space-y-4 text-[#9DC4D5] text-base leading-relaxed">
                <li className="flex gap-4">
                  <span className="text-[#e0211e] flex-shrink-0 font-bold text-lg">✗</span>
                  <span>Terapia</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#e0211e] flex-shrink-0 font-bold text-lg">✗</span>
                  <span>Predicción</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#e0211e] flex-shrink-0 font-bold text-lg">✗</span>
                  <span>Coaching</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#e0211e] flex-shrink-0 font-bold text-lg">✗</span>
                  <span>Promesas de sanación rápida</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* CITA SELLO */}
      <Section background="transparent" border="top">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <blockquote className="text-2xl md:text-3xl font-special-elite text-[#e8ff40] italic leading-relaxed">
            "Aquí no hay gurús. Hay conversación."
          </blockquote>
          <p className="text-[#9DC4D5] text-sm font-semibold">
            — Christian Villamar, creador de AMTME
          </p>
        </div>
      </Section>

      {/* TAROT COMO ESPEJO */}
      <Section background="light" border="top">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-josefin font-bold">El tarot como espejo</h2>

          <p className="text-lg text-[#9DC4D5] leading-relaxed">
            El tarot no predice el futuro. Te ayuda a entenderlo. En AMTME, el tarot es una
            herramienta para la introspección, no para el escapismo. Es una forma de ver con más
            claridad lo que ya está pasando.
          </p>
        </div>
      </Section>

      {/* CTA FINAL */}
      <Section background="dark" border="top">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-josefin font-bold">Comienza aquí</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SPOTIFY_SHOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-4 rounded-lg hover:bg-[#d4eb3a] transition-all duration-200"
            >
              Escuchar en Spotify
            </a>
            <Link
              href="/lecturas"
              className="border border-[#e8ff40]/40 text-white px-8 py-4 rounded-lg hover:border-[#e8ff40] hover:bg-white/5 transition-all duration-200 font-semibold"
            >
              Solicitar lectura simbólica
            </Link>
          </div>
        </div>
      </Section>

      {/* CONECTA */}
      <Section background="transparent" border="top">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-2xl font-josefin font-bold">Conecta</h2>

          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a
              href="https://instagram.com/yosoyvillamar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e8ff40] transition-colors"
            >
              <p className="font-semibold text-white mb-2">@yosoyvillamar</p>
              <p className="text-sm text-[#9DC4D5]">Personal</p>
            </a>

            <div className="hidden sm:block border-r border-white/10"></div>

            <a
              href="https://instagram.com/amitampocomeexplicaron"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e8ff40] transition-colors"
            >
              <p className="font-semibold text-white mb-2">@amitampocomeexplicaron</p>
              <p className="text-sm text-[#9DC4D5]">Podcast</p>
            </a>
          </div>
        </div>
      </Section>

      <PublicFooter />
    </div>
  );
}
