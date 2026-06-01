'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  House,
  FileText,
  Microphone,
  Article,
  Image,
  Palette,
  Calendar,
  ChartLine,
  CurrencyDollar,
  CheckSquare,
  Lightning,
  Archive,
  NotePencil,
  Robot,
  InstagramLogo,
  Gear,
  ListChecks,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useStudio } from '@/components/studio-provider';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';
import { isAuthRequired } from '@/lib/supabase/env';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: House },
  { href: '/documento-maestro', label: 'Documento maestro', icon: FileText },
  { href: '/episodios', label: 'Episodios', icon: Microphone },
  { href: '/revision-episodios', label: 'Revisión episodios', icon: ListChecks },
  { href: '/guiones', label: 'Guiones', icon: Article },
  { href: '/contenido', label: 'Contenido', icon: Image },
  { href: '/creador-visual', label: 'Creador visual', icon: Palette },
  { href: '/calendario', label: 'Calendario', icon: Calendar },
  { href: '/metricas', label: 'Métricas', icon: ChartLine },
  { href: '/monetizacion', label: 'Monetización', icon: CurrencyDollar },
  { href: '/checklists', label: 'Checklists', icon: CheckSquare },
  { href: '/notas', label: 'Notas', icon: NotePencil },
  { href: '/automatizacion', label: 'Automatización', icon: Lightning },
  { href: '/estrategia', label: 'Estrategia', icon: 'TrendingUp' },
    { href: '/historico', label: 'Histórico', icon: Archive },
  { href: '/ia', label: 'IA', icon: Robot },
  { href: '/instagram', label: 'Instagram', icon: InstagramLogo },
  { href: '/configuracion', label: 'Configuración', icon: Gear },
];

const mobileItems = [
  navItems[0], // Dashboard
  navItems[2], // Episodios
  navItems[5], // Contenido
  navItems[8], // Métricas
  navItems[14], // IA
];

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useStudio();
  const authRequired = isAuthRequired();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    try {
      const client = getSupabaseAuthBrowserClient();
      await client?.auth.signOut();
    } finally {
      window.location.href = '/auth/sign-in';
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* ── Sidebar desktop ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0c1f36] z-30">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
            <h1 className="text-base font-semibold text-white tracking-tight">
              AMTME Studio OS
            </h1>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-[#e8ff40] text-[#0c1f36]'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon size={20} weight="regular" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-white/30">
              <kbd className="font-sans">⌘K</kbd> para buscar
            </p>
            {authRequired && (
              <button
                onClick={signOut}
                disabled={signingOut}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {signingOut ? 'Saliendo…' : 'Salir'}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 md:pl-64 min-h-screen">
        <div className="h-full p-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c1f36] border-t border-white/10 z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-[#e8ff40] text-[#0c1f36]'
                    : 'text-white/70'
                )}
              >
                <Icon size={20} weight="regular" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
