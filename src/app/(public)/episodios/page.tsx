import Link from 'next/link';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';

const SPOTIFY_SHOW_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL || 'https://open.spotify.com/show/REEMPLAZA';

const CHRISTIAN_UUID = 'c5b87e86-8520-42a1-b9b4-48f8315a147a';
const CHRISTIAN_UUID_FILTER = `user_id.is.null,user_id.eq.${CHRISTIAN_UUID}`;

interface EpisodeRow {
  id: string;
  payload: {
    episode_number?: number;
    title?: string;
    theme?: string;
    description?: string;
  };
}

async function getAllEpisodes() {
  try {
    const sb = getSupabaseServiceRoleClient();
    if (!sb) return [];
    const { data } = await sb
      .from('episodes')
      .select('id,payload')
      .or(CHRISTIAN_UUID_FILTER)
      .order('payload->>episode_number', { ascending: false });

    return (data || []).map((r: EpisodeRow) => ({
      id: r.id,
      ...r.payload,
    }));
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Episodios | AMTME',
  description:
    'Todos los episodios de A Mí Tampoco Me Explicaron. 34+ conversaciones sobre amor, apego e identidad.',
};

export default async function EpisodiosPage() {
  const episodes = await getAllEpisodes();

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
          <Link href="/episodios" className="text-[#e8ff40] font-semibold">
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
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-[#e8ff40] text-sm font-semibold uppercase tracking-widest mb-4">
          Escúchalos todos
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 font-josefin">
          {episodes.length || '34+'} conversaciones profundas
        </h1>
        <p className="text-[#9DC4D5] text-lg leading-relaxed max-w-2xl">
          Episodios sobre amor, apego, identidad, límites, ruptura y tarot simbólico. Escúchalos en
          Spotify o explora los títulos aquí.
        </p>
        <a
          href={SPOTIFY_SHOW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors"
        >
          Escuchar en Spotify →
        </a>
      </section>

      {/* EPISODIOS GRID */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/10">
        {episodes.length > 0 ? (
          <div className="space-y-4">
            {episodes.map((ep: any) => (
              <a
                key={ep.id}
                href={SPOTIFY_SHOW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-white/10 rounded-2xl p-6 hover:border-[#e8ff40]/40 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="text-[#e8ff40] font-bold text-xl">
                      #{ep.episode_number || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#e8ff40] transition-colors">
                      {ep.title || 'Sin título'}
                    </h3>
                    {ep.theme && <p className="text-[#9DC4D5] text-sm mt-1">{ep.theme}</p>}
                    {ep.description && (
                      <p className="text-[#9DC4D5] text-sm mt-2 line-clamp-2">{ep.description}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-[#e8ff40] text-xl group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#9DC4D5] mb-6">
              Los episodios se cargan desde Spotify. Explora todos aquí:
            </p>
            <a
              href={SPOTIFY_SHOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#e8ff40] text-[#0c1f36] font-semibold px-8 py-3 rounded-full hover:bg-[#d4eb3a] transition-colors"
            >
              Ver en Spotify →
            </a>
          </div>
        )}
      </section>

      {/* FILTROS FUTUROS */}
      {episodes.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/10">
          <p className="text-[#9DC4D5] text-sm text-center">
            Filtros por tema próximamente: Amor, Apego, Identidad, Límites, Ruptura, Tarot simbólico
          </p>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12 bg-white/5">
        <div className="max-w-4xl mx-auto">
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
            <p>© 2026 A Mí Tampoco Me Explicaron</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
