import Link from 'next/link';

interface PublicNavProps {
  activeRoute?: '/' | '/episodios' | '/lecturas' | '/sobre';
}

export function PublicNav({ activeRoute = '/' }: PublicNavProps) {
  const isActive = (route: string) => activeRoute === route;

  return (
    <nav className="fixed top-0 left-0 right-0 z-fixed bg-amtme-navy/95 backdrop-blur-sm border-b border-amtme-yellow/10">
      <div className="container-amtme flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-xl tracking-tight text-amtme-yellow hover:text-amtme-yellow/80 transition-colors duration-200"
        >
          AMTME
        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link
            href="/episodios"
            className={`transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amtme-yellow ${
              isActive('/episodios')
                ? 'text-amtme-yellow font-semibold'
                : 'text-amtme-gray-400 hover:text-amtme-white'
            }`}
          >
            Episodios
          </Link>
          <Link
            href="/lecturas"
            className={`transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amtme-yellow ${
              isActive('/lecturas')
                ? 'text-amtme-yellow font-semibold'
                : 'text-amtme-gray-400 hover:text-amtme-white'
            }`}
          >
            Lecturas
          </Link>
          <Link
            href="/sobre"
            className={`transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amtme-yellow ${
              isActive('/sobre')
                ? 'text-amtme-yellow font-semibold'
                : 'text-amtme-gray-400 hover:text-amtme-white'
            }`}
          >
            Sobre
          </Link>
        </div>

        {/* CTA */}
        <Link
          href="/lecturas"
          className="hidden sm:inline-flex bg-amtme-yellow/10 border border-amtme-yellow/30 text-amtme-yellow px-4 py-2 rounded-md text-sm font-semibold hover:bg-amtme-yellow hover:text-amtme-navy transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amtme-yellow"
        >
          Solicitar lectura
        </Link>
      </div>
    </nav>
  );
}
