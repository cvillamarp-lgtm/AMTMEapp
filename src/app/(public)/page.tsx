import Link from 'next/link';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';

async function getRecentEpisodes() {
  try {
    const sb = getSupabaseServiceRoleClient();
    if (!sb) return [];
    const { data } = await sb
      .from('episodes')
      .select('payload')
      .is('user_id', null)
      .order('created_at', { ascending: false })
      .limit(3);

    return (data || []).map((r: any) => r.payload);
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
        <Link
          href="/auth/sign-in"
          className="text-sm text-[#9DC4D5] hover:text-white transition-colors"
        >
          Acceso estudio →
        </Link>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-[#e8ff40] text-sm font-semibold uppercase tracking-widest mb-4">
          Podcast en español
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          A Mí Tampoco
          <br />
          Me Explicaron
        </h1>
        <p className="text-[#9DC4D5] text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          Conversaciones sobre amor, apego e identidad para hombres que quieren entenderse de
          verdad. No venimos a enseñar. Venimos a recordar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://open.spotify.com/show/amtme"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors"
          >
            Escuchar en Spotify
          </a>
          <a
            href="#lecturas"
            className="border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Lecturas de tarot simbólico
          </a>
        </div>
      </section>

      {/* EPISODIOS RECIENTES */}
      {episodes.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-sm font-semibold text-[#9DC4D5] uppercase tracking-widest mb-6">
            Episodios recientes
          </h2>
          <div className="space-y-4">
            {episodes.map((ep: any, i: number) => (
              <div
                key={i}
                className="border border-white/10 rounded-2xl p-5 hover:border-[#e8ff40]/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-[#e8ff40] font-bold text-sm mt-0.5">
                    #{ep.episode_number || i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{ep.title || 'Sin título'}</h3>
                    <p className="text-[#9DC4D5] text-sm mt-1">{ep.theme || ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LECTURAS DE TAROT */}
      <section id="lecturas" className="bg-white/5 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="text-[#e8ff40] text-sm font-semibold uppercase tracking-widest mb-4">
            Lecturas simbólicas
          </p>
          <h2 className="text-3xl font-bold mb-4">Tarot como herramienta de autoconocimiento</h2>
          <p className="text-[#9DC4D5] mb-8 max-w-lg mx-auto">
            No predicción. No magia. Una lectura profunda de tu momento actual usando el tarot como
            espejo. Para hombres que quieren entender qué les está pasando de verdad.
          </p>
          <a
            href="https://instagram.com/yosoyvillamar"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors inline-block"
          >
            Solicitar lectura por Instagram
          </a>
        </div>
      </section>

      {/* CAPTURA DE LEADS */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Suscríbete al boletín</h2>
          <p className="text-[#9DC4D5] mb-6">
            Reflexiones breves sobre amor e identidad. Sin spam. Sin ruido.
          </p>
          <form
            action="/api/email"
            method="POST"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e8ff40]"
            />
            <button
              type="submit"
              className="bg-[#e8ff40] text-[#0c1f36] font-semibold px-6 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors text-sm"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-[#9DC4D5] text-sm">
        <p>
          © 2026 A Mí Tampoco Me Explicaron ·{' '}
          <a href="https://instagram.com/amtmepodcast" target="_blank" className="hover:text-white">
            @amtmepodcast
          </a>
        </p>
      </footer>
    </div>
  );
}
