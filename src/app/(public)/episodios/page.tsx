import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { PublicNav } from '@/components/public/PublicNav';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Section } from '@/components/public/Section';

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

interface Episode {
  id: string;
  episode_number?: number;
  title?: string;
  theme?: string;
  description?: string;
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
  title: 'Episodios | A Mí Tampoco Me Explicaron',
  description:
    'Conversaciones honestas sobre amor, apego, identidad, límites y todo eso que nadie nos explicó.',
};

export default async function EpisodiosPage() {
  const episodes = await getAllEpisodes();

  return (
    <div className="min-h-screen bg-amtme-navy text-white">
      <PublicNav activeRoute="/episodios" />

      {/* HERO — Editorial */}
      <section className="pt-32 pb-20 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amtme-yellow mb-4">
              Escúchalos todos
            </p>
            <h1 className="text-5xl md:text-6xl font-josefin font-bold leading-tight mb-6">
              Episodios
            </h1>
            <p className="text-lg text-amtme-gray-400 leading-relaxed max-w-3xl">
              Conversaciones honestas sobre amor, apego, identidad, límites y todo eso que nadie nos
              explicó.
            </p>
          </div>

          <a
            href={SPOTIFY_SHOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amtme-yellow text-amtme-navy font-semibold px-8 py-4 rounded-lg hover:bg-amtme-yellow/90 transition-all duration-200"
          >
            Escuchar en Spotify
          </a>
        </div>
      </section>

      {/* EPISODIOS LISTA */}
      <Section background="transparent" border="none">
        {episodes.length > 0 ? (
          <div className="space-y-4">
            {episodes.map((ep: Episode) => (
              <a
                key={ep.id}
                href={SPOTIFY_SHOW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-white/10 rounded-xl p-6 hover:border-[#e8ff40]/30 hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 pt-1">
                    <span className="text-3xl font-bold text-amtme-yellow">
                      {ep.episode_number || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-amtme-yellow transition-colors mb-2">
                      {ep.title || 'Sin título'}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {ep.theme && <p className="text-amtme-gray-400 text-sm">{ep.theme}</p>}
                      {ep.description && (
                        <p className="text-amtme-gray-400 text-sm line-clamp-2">{ep.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-amtme-yellow text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-amtme-gray-400 text-lg mb-8">
              Los episodios se cargan desde Spotify. Explora todos aquí:
            </p>
            <a
              href={SPOTIFY_SHOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amtme-yellow text-amtme-navy font-semibold px-8 py-4 rounded-lg hover:bg-amtme-yellow/90 transition-all duration-200"
            >
              Ver en Spotify
            </a>
          </div>
        )}
      </Section>

      <PublicFooter />
    </div>
  );
}
