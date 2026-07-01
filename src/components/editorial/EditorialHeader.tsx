'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface EditorialHeaderProps {
  onScroll?: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { label: 'Inicio', sectionId: 'top' },
  { label: 'Episodios', sectionId: 'episodios' },
  { label: 'Sobre AMTME', sectionId: 'manifiesto' },
  { label: 'Christian', sectionId: 'christian' },
  { label: 'Newsletter', sectionId: 'newsletter' },
] as const;

export function EditorialHeader({ onScroll }: EditorialHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
      onScroll?.(sectionId);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setMobileMenuOpen(false);
    onScroll?.(sectionId);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: 'rgba(12, 31, 54, 0.1)',
        backgroundColor: 'rgba(245, 242, 234, 0.92)',
      }}
    >
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 lg:px-12">
        <button
          type="button"
          onClick={() => scrollToSection('top')}
          className="group flex items-center gap-2 text-left transition-opacity hover:opacity-80"
          aria-label="Volver al inicio"
        >
          <span className="font-display text-xl tracking-tight" style={{ color: '#0c1f36' }}>
            {BRAND.short}
          </span>
          <span
            className="hidden text-[10px] uppercase tracking-[0.2em] md:inline"
            style={{ color: '#687680' }}
          >
            podcast
          </span>
        </button>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Principal">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollToSection(item.sectionId)}
              className="relative py-2 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#fee94b] after:transition-all hover:opacity-75 hover:after:w-full"
              style={{ color: '#0c1f36' }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="hidden text-xs font-semibold opacity-70 transition-opacity hover:opacity-100 md:inline"
            style={{ color: '#0c1f36' }}
          >
            Studio
          </Link>
          <button
            type="button"
            onClick={() => scrollToSection('featured')}
            className="hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-soft transition-transform hover:-translate-y-[2px] active:translate-y-0 md:inline-flex"
            style={{ backgroundColor: '#0c1f36', color: '#f5f2ea' }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: '#fee94b' }}
              aria-hidden="true"
            />
            Escuchar ahora
          </button>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border md:hidden"
            style={{ borderColor: 'rgba(12, 31, 54, 0.15)', color: '#0c1f36' }}
          >
            {mobileMenuOpen ? <X width={22} /> : <Menu width={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          className="border-t md:hidden"
          style={{ borderColor: 'rgba(12, 31, 54, 0.1)', backgroundColor: '#f5f2ea' }}
          aria-label="Menú móvil"
        >
          <div className="space-y-1 px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.sectionId)}
                className="block w-full rounded-xl px-3 py-3 text-left text-base font-medium transition-colors hover:bg-[#0c1f36]/5"
                style={{ color: '#0c1f36' }}
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full rounded-xl px-3 py-3 text-left text-base font-medium transition-colors hover:bg-[#0c1f36]/5"
              style={{ color: '#0c1f36' }}
            >
              Studio
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('featured')}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
              style={{ backgroundColor: '#0c1f36', color: '#f5f2ea' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#fee94b' }} />
              Escuchar ahora
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
