import Link from 'next/link';

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
          <Link href="/lecturas" className="text-[#9DC4D5] hover:text-white transition-colors">
            Lecturas
          </Link>
          <Link href="/sobre" className="text-[#e8ff40] font-semibold">
            Sobre
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#e8ff40] text-sm font-semibold uppercase tracking-widest mb-4">
          La historia
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 font-josefin">
          No te habla alguien que ya llegó
        </h1>
        <p className="text-[#9DC4D5] text-lg leading-relaxed max-w-2xl">
          Te habla alguien que también está aprendiendo a nombrar lo que antes solo dolía.
        </p>
      </section>

      {/* ACERCA DE CHRISTIAN */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 font-josefin">Christian Villamar</h2>
            <div className="space-y-4 text-[#9DC4D5] leading-relaxed">
              <p>
                Creador de AMTME. Hospedera de conversaciones profundas. Practicante de tarot
                simbólico. Alguien que aprendió tarde a nombrar lo que sentía.
              </p>
              <p>
                Durante años guardé silencio sobre los patrones que repetía, las relaciones que
                elegía, la identidad que construía. Cuando empecé a observar, a nombrar, a entender
                — algo cambió.
              </p>
              <p>
                AMTME nació de esa pregunta: ¿qué hacemos con todo lo que sentimos pero que nadie
                nos enseñó a entender?
              </p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[#e8ff40] font-bold">34+</p>
                <p className="text-[#9DC4D5]">episodios publicados</p>
              </div>
              <div>
                <p className="text-[#e8ff40] font-bold">8,700+</p>
                <p className="text-[#9DC4D5]">escuchas totales</p>
              </div>
              <div>
                <p className="text-[#e8ff40] font-bold">15+</p>
                <p className="text-[#9DC4D5]">países de escuchas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ ES AMTME */}
      <section className="bg-white/5 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-12 font-josefin">Qué es AMTME</h2>
          <div className="space-y-8">
            <p className="text-[#9DC4D5] text-lg leading-relaxed">
              A Mí Tampoco Me Explicaron nació porque nadie nos enseñó qué hacer cuando el amor
              duele, cuando un vínculo te confunde o cuando no reconoces la persona en la que te has
              convertido.
            </p>
            <p className="text-[#9DC4D5] text-lg leading-relaxed">
              Este es el espacio que hubiera querido encontrar cuando más lo necesitaba. No para que
              alguien te diga qué hacer. Para que puedas por fin nombrarlo.
            </p>
            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <h3 className="text-xl font-bold mb-4 text-[#e8ff40]">Qué sí es</h3>
                <ul className="space-y-2 text-[#9DC4D5] text-sm">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Un refugio simbólico</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Una conversación honesta</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Una forma de nombrar lo que antes dolía en silencio</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Episodios sobre amor, apego, identidad, límites, duelo</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-[#e0211e]">Qué no es</h3>
                <ul className="space-y-2 text-[#9DC4D5] text-sm">
                  <li className="flex gap-2">
                    <span>✗</span>
                    <span>Terapia</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✗</span>
                    <span>Predicción</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✗</span>
                    <span>Coaching</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✗</span>
                    <span>Promesas de sanación rápida</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITA */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white/10">
        <blockquote className="border-l-4 border-[#e8ff40] pl-6 font-special-elite text-2xl text-[#e8ff40] italic">
          "Aquí no hay gurús. Hay conversación."
        </blockquote>
        <p className="text-[#9DC4D5] text-sm mt-6">— Christian Villamar, creador de AMTME</p>
      </section>

      {/* ESCUCHA Y EXPLORA */}
      <section className="bg-white/5 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-8 font-josefin">Escucha y explora</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <a
              href={SPOTIFY_SHOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#e8ff40] text-[#0c1f36] font-semibold px-6 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors"
            >
              Escuchar episodios
            </a>
            <Link
              href="/lecturas"
              className="border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Solicitar lectura
            </Link>
          </div>
        </div>
      </section>

      {/* CONECTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white/10">
        <h2 className="text-2xl font-bold mb-8 text-center font-josefin">Conecta</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="https://instagram.com/yosoyvillamar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9DC4D5] hover:text-white transition-colors text-center"
          >
            <p className="font-semibold mb-1">@yosoyvillamar</p>
            <p className="text-sm">Personal</p>
          </a>
          <div className="hidden sm:block border-r border-white/10"></div>
          <a
            href="https://instagram.com/amitampocomeexplicaron"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9DC4D5] hover:text-white transition-colors text-center"
          >
            <p className="font-semibold mb-1">@amitampocomeexplicaron</p>
            <p className="text-sm">Podcast</p>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12 bg-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3">Contenido</h4>
              <ul className="space-y-2 text-[#9DC4D5] text-sm">
                <li>
                  <Link href="/episodios" className="hover:text-white transition-colors">
                    Episodios
                  </Link>
                </li>
                <li>
                  <Link href="/lecturas" className="hover:text-white transition-colors">
                    Lecturas simbólicas
                  </Link>
                </li>
                <li>
                  <a
                    href={SPOTIFY_SHOW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Spotify
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Sobre</h4>
              <ul className="space-y-2 text-[#9DC4D5] text-sm">
                <li>
                  <Link href="/sobre" className="hover:text-white transition-colors">
                    Acerca de AMTME
                  </Link>
                </li>
                <li>
                  <a
                    href="https://instagram.com/yosoyvillamar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    @yosoyvillamar
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-[#9DC4D5] text-sm">
            <p>© 2026 A Mí Tampoco Me Explicaron · Hecho con claridad y sin certezas vacías</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
