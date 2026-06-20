import { BRAND } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-navy px-6 pb-10 pt-24 text-cream lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-12 border-b border-cream/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="font-display text-3xl">{BRAND.short}</div>
            <p className="mt-6 max-w-md font-display text-2xl leading-tight text-cream">
              Lo que pensamos,<br /> lo que sentimos,<br />
              <span className="underline-lime !text-navy">pero que nadie nos explicó.</span>
            </p>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-lime">Navegar</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li><a href="/">Inicio</a></li>
              <li><a href="/#episodios">Episodios</a></li>
              <li><a href="/#manifiesto">Sobre AMTME</a></li>
              <li><a href="/#christian">Christian</a></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-lime">Escuchar</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li><a href="#">Spotify</a></li>
              <li><a href="#">Apple Podcasts</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">iVoox</a></li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-lime">Contacto</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li>{BRAND.email}</li>
              <li>Prensa y colaboraciones</li>
              <li>
                <a href={BRAND.instagram} className="underline-lime !text-navy">{BRAND.handle}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-cream/50 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} {BRAND.name} · {BRAND.host}</div>
          <div className="flex gap-6">
            <a href="#">Aviso de privacidad</a>
            <a href="#">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
