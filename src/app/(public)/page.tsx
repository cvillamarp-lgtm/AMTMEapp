import Link from 'next/link';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { PublicNav } from '@/components/public/PublicNav';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Section } from '@/components/public/Section';

const SPOTIFY_SHOW_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL || 'https://open.spotify.com/show/REEMPLAZA';

const CHRISTIAN_UUID = 'c5b87e86-8520-42a1-b9b4-48f8315a147a';
const CHRISTIAN_UUID_FILTER = `user_id.is.null,user_id.eq.${CHRISTIAN_UUID}`;

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((r: any) => r.payload);
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'A Mí Tampoco Me Explicaron | Podcast sobre amor, apego e identidad',
  description:
    'Un podcast honesto sobre amor, apego, identidad y todo eso que sentimos pero nadie nos enseñó a nombrar. Tarot como espejo. 34+ episodios.',
};

export default async function HomePage() {
  const episodes = await getRecentEpisodes();

  return (
    <div className="min-h-screen bg-amtme-navy text-white">
      <PublicNav activeRoute="/" />

      {/* HERO — Editorial y sobrio */}
      <section className="pt-32 pb-24 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div>
            <p className="text-amtme-yellow text-xs font-bold uppercase tracking-[0.15em] mb-6">
              Nadie te explicó esto
            </p>
            <h1 className="text-5xl md:text-7xl font-josefin font-bold leading-[1.1] mb-8">
              Yo tampoco lo tengo resuelto.
              <br />
              <span className="text-amtme-gray-400">Pero lo buscamos juntos.</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-amtme-gray-400 leading-relaxed max-w-2xl mx-auto">
            Un pódcast sobre amor, apego, identidad y todo eso que sentimos, pero que nadie nos
            enseñó a nombrar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href={SPOTIFY_SHOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amtme-yellow text-amtme-navy font-semibold px-8 py-4 rounded-lg hover:bg-amtme-lemon transition-all duration-200"
            >
              Escuchar en Spotify
            </a>
            <Link
              href="/lecturas"
              className="border border-amtme-yellow/40 text-white px-8 py-4 rounded-lg hover:border-amtme-yellow hover:bg-white/5 transition-all duration-200"
            >
              Explorar lecturas simbólicas
            </Link>
          </div>
        </div>
      </section>

      {/* QUÉ ES AMTME — 4 Pilares */}
      <Section background="light" border="none">
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-josefin font-bold">
              Un espacio para nombrar lo que sentimos
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Acompañamiento',
                description: 'No estás solo en lo que sientes',
              },
              {
                title: 'Honestidad radical',
                description: 'Sin filtros, sin máscaras, sin pretensiones',
              },
              {
                title: 'Presencia antes que certeza',
                description: 'Estar en el proceso es suficiente',
              },
              {
                title: 'Humildad del camino',
                description: 'Nadie lo tiene todo resuelto',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] hover:border-amtme-yellow/20 hover:bg-white/5 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-amtme-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* EPISODIOS RECIENTES */}
      {episodes.length > 0 && (
        <Section background="transparent" border="top">
          <div className="space-y-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-amtme-yellow mb-4">
                Últimos episodios
              </p>
              <h2 className="text-3xl md:text-4xl font-josefin font-bold">
                Conversaciones honestas
              </h2>
            </div>

            <div className="space-y-4">
              {episodes.map((ep, i) => (
                <Link
                  key={i}
                  href="/episodios"
                  className="group block border border-white/10 rounded-xl p-6 hover:border-amtme-yellow/30 hover:bg-white/5 transition-all duration-200"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <span className="text-2xl font-bold text-amtme-yellow">
                        {ep.episode_number || i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-amtme-yellow transition-colors mb-2">
                        {ep.title || 'Sin título'}
                      </h3>
                      {ep.theme && <p className="text-amtme-gray-400 text-sm">{ep.theme}</p>}
                    </div>
                    <div className="flex-shrink-0 text-amtme-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/episodios"
                className="inline-flex items-center gap-2 text-amtme-yellow hover:text-white transition-colors font-semibold text-sm"
              >
                Ver todos los episodios
                <span>→</span>
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* LECTURAS SIMBÓLICAS */}
      <Section background="dark" border="top">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amtme-yellow mb-4">
              Lectura personalizada
            </p>
            <h2 className="text-3xl md:text-4xl font-josefin font-bold mb-6">
              Tarot simbólico: una lectura de tu momento actual
            </h2>
          </div>

          <p className="text-lg text-amtme-gray-400 leading-relaxed">
            No predigo nada. No hago magia. Uso el tarot como espejo: una forma de ordenar lo que
            tienes en la cabeza y no sabes cómo nombrar.
          </p>

          <div className="grid md:grid-cols-4 gap-4 py-8">
            <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
              <p className="text-2xl font-bold text-amtme-yellow mb-1">$350</p>
              <p className="text-xs text-amtme-gray-400">MXN / $18 USD</p>
            </div>
            <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
              <p className="text-2xl font-bold text-amtme-yellow mb-1">48–72h</p>
              <p className="text-xs text-amtme-gray-400">Entrega escrita</p>
            </div>
            <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
              <p className="text-2xl font-bold text-amtme-yellow mb-1">1</p>
              <p className="text-xs text-amtme-gray-400">Seguimiento incluido</p>
            </div>
            <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
              <p className="text-2xl font-bold text-amtme-yellow mb-1">Tuya</p>
              <p className="text-xs text-amtme-gray-400">La pregunta</p>
            </div>
          </div>

          <Link
            href="/lecturas"
            className="inline-block bg-amtme-yellow text-amtme-navy font-semibold px-8 py-4 rounded-lg hover:bg-[#d4eb3a] transition-all duration-200"
          >
            Solicitar lectura
          </Link>
        </div>
      </Section>

      {/* NEWSLETTER */}
      <Section background="transparent" border="top">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-amtme-yellow mb-4">
                Una carta breve
              </p>
              <h2 className="text-3xl md:text-4xl font-josefin font-bold mb-4">
                Cada dos semanas en tu bandeja
              </h2>
              <p className="text-lg text-amtme-gray-400 leading-relaxed">
                Reflexiones sobre amor, apego e identidad. Sin spam. Sin ruido.
              </p>
            </div>

            <form action="/api/email" method="POST" className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-5 py-4 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amtme-yellow focus:bg-white/15 transition-colors"
              />
              <input type="hidden" name="type" value="newsletter" />
              <button
                type="submit"
                className="bg-amtme-yellow text-amtme-navy font-semibold px-8 py-4 rounded-lg hover:bg-[#d4eb3a] transition-all duration-200 whitespace-nowrap"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </Section>

      <PublicFooter />
    </div>
  );
}
