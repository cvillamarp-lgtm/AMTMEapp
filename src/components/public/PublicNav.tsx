import Link from 'next/link';

interface PublicNavProps {
  activeRoute?: '/' | '/episodios' | '/lecturas' | '/sobre';
}

export function PublicNav({ activeRoute = '/' }: PublicNavProps) {
  const isActive = (route: string) => activeRoute === route;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c1f36]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-lg tracking-tight hover:text-[#e8ff40] transition-colors duration-200"
        >
          AMTME
        </Link>

        {/* Menu */}
        <div className="flex gap-8 text-sm">
          <Link
            href="/episodios"
            className={`transition-colors duration-200 ${
              isActive('/episodios')
                ? 'text-[#e8ff40] font-semibold'
                : 'text-[#9DC4D5] hover:text-white'
            }`}
          >
            Episodios
          </Link>
          <Link
            href="/lecturas"
            className={`transition-colors duration-200 ${
              isActive('/lecturas')
                ? 'text-[#e8ff40] font-semibold'
                : 'text-[#9DC4D5] hover:text-white'
            }`}
          >
            Lecturas
          </Link>
          <Link
            href="/sobre"
            className={`transition-colors duration-200 ${
              isActive('/sobre')
                ? 'text-[#e8ff40] font-semibold'
                : 'text-[#9DC4D5] hover:text-white'
            }`}
          >
            Sobre
          </Link>
        </div>

        {/* CTA */}
        <Link
          href="/lecturas"
          className="hidden sm:inline-block bg-[#e8ff40]/10 border border-[#e8ff40]/30 text-[#e8ff40] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#e8ff40] hover:text-[#0c1f36] transition-all duration-200"
        >
          Solicitar lectura
        </Link>
      </div>
    </nav>
  );
}
