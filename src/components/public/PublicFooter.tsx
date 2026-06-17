import Link from 'next/link';

const SPOTIFY_SHOW_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL || 'https://open.spotify.com/show/REEMPLAZA';

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">
          {/* Contenido */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Contenido
            </h4>
            <ul className="space-y-3 text-[#9DC4D5] text-sm">
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

          {/* Sobre */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Sobre
            </h4>
            <ul className="space-y-3 text-[#9DC4D5] text-sm">
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

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Contacto
            </h4>
            <ul className="space-y-3 text-[#9DC4D5] text-sm">
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

        {/* Divider y Copyright con link discreto al Studio */}
        <div className="border-t border-white/10 pt-8 text-center text-[#9DC4D5] text-xs">
          <p className="mb-3">
            © 2026 A Mí Tampoco Me Explicaron · Hecho con claridad y sin certezas vacías
          </p>
          <Link
            href="/dashboard"
            className="inline-block text-white/20 hover:text-white/40 transition-colors text-[11px] tracking-wider"
          >
            ESTUDIO
          </Link>
        </div>
      </div>
    </footer>
  );
}
