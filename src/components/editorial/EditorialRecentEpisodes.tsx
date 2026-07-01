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
    <section id="episodios" className="px-6 py-24 lg:px-12 lg:py-32" aria-labelledby="recent-episodes-title">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]" style={{ color: '#687680' }}>
              <span className="h-px w-8" style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }} />
              Catálogo
            </div>
            <h2 id="recent-episodes-title" className="mt-5 font-display text-4xl leading-none lg:text-6xl" style={{ color: '#0c1f36' }}>
              Episodios recientes
            </h2>
          </div>
          <Link href="/episodios" className="text-sm font-semibold" style={{ color: '#0c1f36' }}>
            <span className="underline-lime inline-block">Ver todos los episodios →</span>
          </Link>
        </div>

        {episodes.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep) => (
              <article key={ep.id} className="group flex flex-col overflow-hidden rounded-[2rem] border bg-white transition-all hover:-translate-y-1 hover:shadow-card-hover" style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}>
                <Link href="/episodios" className="relative block aspect-square overflow-hidden" aria-label={`Escuchar ${ep.title || 'episodio de AMTME'}`}>
                  {ep.cover_url ? (
                    <img src={ep.cover_url} alt={ep.title || 'Episodio de AMTME'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #0c1f36 0%, #0c1f36 58%, #fee94b 58%, #fee94b 100%)' }}>
                      <span className="font-display text-4xl" style={{ color: 'rgba(245, 242, 234, 0.38)' }}>AMTME</span>
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: '#f5f2ea', color: '#0c1f36' }}>
                    {ep.episode_number ? `EP ${ep.episode_number}` : 'AMTME'}
                  </span>
                  <span aria-hidden="true" className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z" /></svg>
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-7">
                  <div className="text-xs uppercase tracking-[0.18em]" style={{ color: '#687680' }}>
                    {ep.theme || 'Vínculos · Dignidad'}
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight" style={{ color: '#0c1f36' }}>
                    <Link href="/episodios" className="hover:underline">
                      {ep.title || 'Episodio AMTME'}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed line-clamp-2" style={{ color: 'rgba(12, 31, 54, 0.65)' }}>
                    {ep.description || 'Una conversación honesta sobre amor, apego, límites y volver a uno mismo.'}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t pt-5" style={{ borderColor: 'rgba(12, 31, 54, 0.1)' }}>
                    <Link href="/episodios" className="text-sm font-semibold hover:opacity-70" style={{ color: '#0c1f36' }}>
                      Escuchar →
                    </Link>
                    <div className="flex gap-1.5" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#fee94b' }} />
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#0c1f36' }} />
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#e0211e' }} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-[2rem] border p-10 text-center" style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.45)' }}>
            <p style={{ color: '#687680' }}>Los episodios se cargan desde el catálogo público. También puedes explorarlos directamente aquí:</p>
            <Link href="/episodios" className="mt-6 inline-block rounded-full px-8 py-3 text-sm font-semibold transition-transform hover:-translate-y-[2px]" style={{ backgroundColor: '#fee94b', color: '#0c1f36' }}>
              Ver todos los episodios
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
