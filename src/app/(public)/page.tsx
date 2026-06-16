import Link from 'next/link';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';

const SPOTIFY_SHOW_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL || 'https://open.spotify.com/show/REEMPLAZA';

// FASE 8C.1 — Compatibilidad de lectura dual
const CHRISTIAN_UUID = 'c5b87e86-8520-42a1-b9b4-48f8315a147a';
const CHRISTIAN_UUID_FILTER = `user_id.is.null,user_id.eq.${CHRISTIAN_UUID}`;

interface EpisodeRow {
  payload: {
    episode_number?: number;
    title?: string;
    theme?: string;
  };
}

async function getRecentEpisodes() {
  try {
    const sb = getSupabaseServiceRoleClient();
    if (!sb) return [];
    const { data } = await sb
      .from('episodes')
      .select('payload')
      .or(CHRISTIAN_UUID_FILTER)
      .order('created_at', { ascending: false })
      .limit(3);

    return (data || []).map((r: EpisodeRow) => r.payload);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const episodes = await getRecentEpisodes();

  return (
    <div className="min-h-screen bg-[#0c1f36] text-white">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span className="font-bold text-lg tracking-tight">AMTME</span>
        <div className="flex gap-6 text-sm">
          <Link href="/episodios" className="text-[#9DC4D5] hover:text-white transition-colors">
            Episodios
          </Link>
          <Link href="/lecturas" className="text-[#9DC4D5] hover:text-white transition-colors">
            Lecturas
          </Link>
          <Link href="/sobre" className="text-[#9DC4D5] hover:text-white transition-colors">
            Sobre
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-[#e8ff40] text-sm font-semibold uppercase tracking-widest mb-4">
          Tarot como espejo
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-josefin">
          A Mí Tampoco Me Explicaron
        </h1>
        <p className="text-[#9DC4D5] text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Un espacio para nombrar lo que sentimos, lo que repetimos y lo que nadie nos explicó sobre
          el amor, el apego y la identidad. 34+ conversaciones profundas. Sin certezas vacías, solo
          claridad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={SPOTIFY_SHOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors"
          >
            Escuchar en Spotify →
          </a>
          <Link
            href="/lecturas"
            className="border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Lecturas simbólicas
          </Link>
        </div>
      </section>

      {/* EPISODIOS RECIENTES */}
      {episodes.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-sm font-semibold text-[#9DC4D5] uppercase tracking-widest mb-6">
            Últimos episodios
          </h2>
          <div className="space-y-4">
            {episodes.map((ep, i) => (
              <Link
                key={i}
                href="/episodios"
                className="block border border-white/10 rounded-2xl p-5 hover:border-[#e8ff40]/40 hover:bg-white/5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="text-[#e8ff40] font-bold text-sm mt-0.5 flex-shrink-0">
                    #{ep.episode_number || i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white line-clamp-2">
                      {ep.title || 'Sin título'}
                    </h3>
                    <p className="text-[#9DC4D5] text-sm mt-1">{ep.theme || ''}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/episodios"
              className="text-[#e8ff40] hover:text-white transition-colors text-sm font-semibold"
            >
              Ver todos los episodios →
            </Link>
          </div>
        </section>
      )}

      {/* LECTURAS DE TAROT */}
      <section className="bg-white/5 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="text-[#e8ff40] text-sm font-semibold uppercase tracking-widest mb-4">
            Lectura simbólica
          </p>
          <h2 className="text-3xl font-bold mb-4 font-josefin">Una lectura de tu lugar actual</h2>
          <p className="text-[#9DC4D5] mb-8 max-w-lg mx-auto leading-relaxed">
            No para que alguien te diga lo que va a pasar. Para que puedas ver con más claridad lo
            que ya está pasando. Una lectura profunda y personalizada usando el tarot como
            herramienta de introspección.
          </p>
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm max-w-md mx-auto">
            <div>
              <p className="text-[#e8ff40] font-bold text-lg">$350</p>
              <p className="text-[#9DC4D5] text-xs">MXN</p>
            </div>
            <div>
              <p className="text-[#e8ff40] font-bold text-lg">48–72h</p>
              <p className="text-[#9DC4D5] text-xs">Entrega</p>
            </div>
            <div>
              <p className="text-[#e8ff40] font-bold text-lg">∞</p>
              <p className="text-[#9DC4D5] text-xs">Seguimiento</p>
            </div>
            <div>
              <p className="text-[#e8ff40] font-bold text-lg">Tuya</p>
              <p className="text-[#9DC4D5] text-xs">Pregunta</p>
            </div>
          </div>
          <Link
            href="/lecturas"
            className="bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors inline-block"
          >
            Solicitar mi lectura →
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-[#e8ff40] text-sm font-semibold uppercase tracking-widest mb-4">
            Una carta breve
          </p>
          <h2 className="text-2xl font-bold mb-3 font-josefin">Cada dos semanas en tu bandeja</h2>
          <p className="text-[#9DC4D5] mb-6 max-w-md mx-auto">
            Reflexiones sobre amor, apego e identidad. Sin spam. Sin ruido. Solo lo que vale la pena
            leer a las 7 de la mañana.
          </p>
          <form
            action="/api/email"
            method="POST"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              required
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40]"
            />
            <input type="hidden" name="type" value="newsletter" />
            <button
              type="submit"
              className="bg-[#e8ff40] text-[#0c1f36] font-semibold px-6 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors text-sm whitespace-nowrap"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12">
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
                <li>
                  <a
                    href="https://instagram.com/amitampocomeexplicaron"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    @amitampocomeexplicaron
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Contacto</h4>
              <ul className="space-y-2 text-[#9DC4D5] text-sm">
                <li>
                  <a
                    href="mailto:hola@amitampocomeexplicaron.com"
                    className="hover:text-white transition-colors"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <Link href="/lecturas" className="hover:text-white transition-colors">
                    Solicitar lectura
                  </Link>
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
