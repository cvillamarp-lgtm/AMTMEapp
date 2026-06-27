import Link from 'next/link';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';

interface Episode {
  id: string;
  episode_number?: number;
  title?: string;
  theme?: string;
  description?: string;
  cover_url?: string;
}

const CHRISTIAN_UUID = 'c5b87e86-8520-42a1-b9b4-48f8315a147a';
const CHRISTIAN_UUID_FILTER = `user_id.is.null,user_id.eq.${CHRISTIAN_UUID}`;

async function getRecentEpisodes() {
  try {
    const sb = getSupabaseServiceRoleClient();
    if (!sb) return [];
    const { data } = await sb
      .from('episodes')
      .select('id,payload')
      .or(CHRISTIAN_UUID_FILTER)
      .order('payload->>episode_number', { ascending: false })
      .limit(3);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((r: any) => ({
      id: r.id,
      ...r.payload,
    })) as Episode[];
  } catch {
    return [];
  }
}

export async function EditorialRecentEpisodes() {
  const episodes = await getRecentEpisodes();

  return (
    <section id="episodios" className="px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
              style={{ color: '#687680' }}
            >
              <span
                className="h-px w-8"
                style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}
              ></span>
              Catálogo
            </div>
            <h2 className="mt-5 font-bold text-4xl lg:text-6xl">Episodios recientes.</h2>
          </div>
          <Link
            href="/episodios"
            className="text-sm font-semibold relative inline-block"
            style={{ color: '#0c1f36' }}
          >
            <span className="relative inline-block">
              Ver todos los episodios →
              <span
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{ backgroundColor: 'rgba(254, 233, 75, 0.5)', zIndex: -1 }}
              ></span>
            </span>
          </Link>
        </div>

        {episodes.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep) => (
              <article
                key={ep.id}
                className="group flex flex-col overflow-hidden rounded-3xl border bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
              >
                <div className="relative block aspect-square overflow-hidden bg-gradient-to-br from-[#0c1f36] to-[#fee94b]">
                  {ep.cover_url ? (
                    <img
                      src={ep.cover_url}
                      alt={ep.title || 'Episodio'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                      >
                        EP
                      </span>
                    </div>
                  )}
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: '#f5f2ea', color: '#0c1f36' }}
                  >
                    EP {ep.episode_number}
                  </span>
                  <span
                    aria-label="Reproducir"
                    className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4l14 8-14 8V4z"></path>
                    </svg>
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <div className="text-xs uppercase tracking-[0.18em]" style={{ color: '#687680' }}>
                    {ep.theme || 'Tema'}
                  </div>
                  <h3 className="mt-3 font-bold text-2xl leading-tight">
                    <span className="hover:underline cursor-pointer">
                      {ep.title || 'Sin título'}
                    </span>
                  </h3>
                  <p
                    className="mt-3 flex-1 text-sm leading-relaxed line-clamp-2"
                    style={{ color: 'rgba(12, 31, 54, 0.65)' }}
                  >
                    {ep.description || 'Episodio del podcast AMTME'}
                  </p>

                  <div
                    className="mt-6 flex items-center justify-between border-t pt-5"
                    style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}
                  >
                    <Link href="/episodios" className="text-sm font-semibold hover:opacity-70">
                      Escuchar →
                    </Link>
                    <div className="flex gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: '#fee94b' }}
                      ></span>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: '#0c1f36' }}
                      ></span>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: '#e74c3c' }}
                      ></span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 text-center py-12">
            <p style={{ color: '#687680' }}>
              Los episodios se cargan desde Spotify. Explora todos aquí:
            </p>
            <Link
              href="/episodios"
              className="mt-6 inline-block rounded-full px-8 py-3 text-sm font-semibold"
              style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}
            >
              Ver todos los episodios
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
