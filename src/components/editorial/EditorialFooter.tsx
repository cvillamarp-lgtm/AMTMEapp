import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export function EditorialFooter() {
  return (
    <footer className="px-6 pb-10 pt-24 text-white lg:px-12" style={{ backgroundColor: '#0c1f36' }}>
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-12 border-b pb-16 lg:grid-cols-12" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="lg:col-span-5">
            <div className="font-display text-3xl">{BRAND.short}</div>
            <p className="mt-6 max-w-md font-display text-2xl leading-tight">
              Lo que pensamos,
              <br />
              lo que sentimos,
              <br />
              <span className="underline-lime inline-block text-[#0c1f36]">pero que nadie nos explicó.</span>
            </p>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
              Navegar
            </h4>
            <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/#episodios">Episodios</Link></li>
              <li><Link href="/#manifiesto">Sobre AMTME</Link></li>
              <li><Link href="/#christian">Christian</Link></li>
              <li><Link href="/studio">Studio</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
              Escuchar
            </h4>
            <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li><a href={BRAND.spotifyUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Spotify</a></li>
              <li><a href={BRAND.applePodcastsUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Apple Podcasts</a></li>
              <li><a href={BRAND.youtubeUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">YouTube</a></li>
              <li><a href={BRAND.ivooxUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">iVoox</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em]" style={{ color: '#fee94b' }}>
              Comunidad
            </h4>
            <ul className="mt-5 space-y-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li>{BRAND.email}</li>
              <li>Prensa, colaboraciones y comunidad AMTME.</li>
              <li>
                <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="relative inline-block transition-colors hover:text-white">
                  <span className="underline-lime inline-block text-[#0c1f36]">{BRAND.handle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs md:flex-row md:items-center" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          <div>© 2026 {BRAND.name} · {BRAND.host}</div>
          <div className="flex gap-6">
            <span>Aviso de privacidad</span>
            <span>Términos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
