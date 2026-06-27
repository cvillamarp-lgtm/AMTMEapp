'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface EditorialHeaderProps {
  onScroll?: (sectionId: string) => void;
}

export function EditorialHeader({ onScroll }: EditorialHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
    onScroll?.(sectionId);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        borderColor: 'rgba(12, 31, 54, 0.1)',
        backgroundColor: 'rgba(245, 242, 234, 0.9)',
      }}
    >
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
          <span className="font-black text-xl tracking-tighter" style={{ color: '#0c1f36' }}>
            AMTME
          </span>
          <span
            className="hidden text-[10px] uppercase tracking-[0.2em]"
            style={{ color: '#687680 ' }}
          >
            podcast
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <button
            onClick={() => scrollToSection('featured')}
            className="relative py-2 text-sm font-medium transition-colors hover:text-navy/70"
            style={{ color: '#0c1f36' }}
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection('episodios')}
            className="relative py-2 text-sm font-medium transition-colors hover:text-navy/70"
            style={{ color: '#0c1f36' }}
          >
            Episodios
          </button>
          <button
            onClick={() => scrollToSection('manifiesto')}
            className="relative py-2 text-sm font-medium transition-colors hover:text-navy/70"
            style={{ color: '#0c1f36' }}
          >
            Sobre AMTME
          </button>
          <button
            onClick={() => scrollToSection('christian')}
            className="relative py-2 text-sm font-medium transition-colors hover:text-navy/70"
            style={{ color: '#0c1f36' }}
          >
            Christian
          </button>
          <button
            onClick={() => scrollToSection('newsletter')}
            className="relative py-2 text-sm font-medium transition-colors hover:text-navy/70"
            style={{ color: '#0c1f36' }}
          >
            Newsletter
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="hidden text-xs font-semibold opacity-70 hover:opacity-100 md:inline"
            style={{ color: '#0c1f36' }}
          >
            Studio
          </Link>
          <button
            onClick={() => scrollToSection('featured')}
            className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-soft"
            style={{ backgroundColor: '#0c1f36', color: '#f5f2ea' }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: '#fee94b' }}
            ></span>
            Escuchar ahora
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-10 w-10 place-items-center rounded-full border md:hidden"
            style={{ borderColor: 'rgba(12, 31, 54, 0.15)', color: '#0c1f36' }}
          >
            {mobileMenuOpen ? <X width={22} /> : <Menu width={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav
          className="border-t md:hidden"
          style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
        >
          <div className="space-y-3 px-6 py-4">
            <button
              onClick={() => scrollToSection('featured')}
              className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('episodios')}
              className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
            >
              Episodios
            </button>
            <button
              onClick={() => scrollToSection('manifiesto')}
              className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
            >
              Sobre AMTME
            </button>
            <button
              onClick={() => scrollToSection('christian')}
              className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
            >
              Christian
            </button>
            <button
              onClick={() => scrollToSection('newsletter')}
              className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
            >
              Newsletter
            </button>
            <Link
              href="/studio"
              className="block w-full text-left text-sm font-medium py-2 hover:opacity-70"
            >
              Studio
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
