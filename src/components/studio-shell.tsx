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
  SignOut,
  Warning,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useStudio } from '@/components/studio-provider';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';
import { isAuthRequired } from '@/lib/supabase/env';
import { useIdleLogout } from '@/hooks/use-idle-logout';
import { GlobalCommandPalette } from '@/components/global-command-palette';

const ALL_NAV_ITEMS = [
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
  { href: '/historico', label: 'Histórico', icon: Archive },
  { href: '/ia', label: 'IA', icon: Robot },
  { href: '/instagram', label: 'Instagram', icon: InstagramLogo },
  { href: '/configuracion', label: 'Configuración', icon: Gear },
];

const DEFAULT_NAV_ORDER = ALL_NAV_ITEMS.map((item) => item.href);
const DEFAULT_MOBILE_ITEMS = ['/dashboard', '/episodios', '/contenido', '/metricas', '/ia'];

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useStudio();
  const authRequired = isAuthRequired();
  const [signingOut, setSigningOut] = useState(false);

  const navPrefs = state.config.navPreferences;
  const navOrder = navPrefs?.order ?? DEFAULT_NAV_ORDER;
  const hiddenItems = navPrefs?.hidden ?? [];
  const mobileItemHrefs = navPrefs?.mobileItems ?? DEFAULT_MOBILE_ITEMS;

  const navItems = navOrder
    .map((href) => ALL_NAV_ITEMS.find((item) => item.href === href))
    .filter((item) => item && !hiddenItems.includes(item.href)) as typeof ALL_NAV_ITEMS;

  const mobileItems = mobileItemHrefs
    .map((href) => ALL_NAV_ITEMS.find((item) => item.href === href))
    .filter((item) => !!item)
    .slice(0, 5) as typeof ALL_NAV_ITEMS;

  const signOut = async () => {
    setSigningOut(true);
    try {
      const client = getSupabaseAuthBrowserClient();
      await client?.auth.signOut();
    } finally {
      window.location.href = '/auth/sign-in';
    }
  };

  const { showWarning, keepSession, signOutNow, remainingSeconds } = useIdleLogout({
    enabled: authRequired,
    idleMs: 5 * 60 * 1000,
    warningMs: 4 * 60 * 1000,
  });

  return (
    <div className="flex min-h-screen bg-amtme-navy font-body">
      {/* ── Banner de inactividad ────────────────────────────────────────── */}
      {showWarning && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="idle-title"
          aria-describedby="idle-desc"
          className="fixed inset-0 z-modal flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-premium border border-black/[0.05]">
            <div className="flex items-start gap-3">
              <Warning size={22} weight="fill" className="mt-0.5 shrink-0 text-amtme-yellow" />
              <div>
                <p id="idle-title" className="text-sm font-semibold text-amtme-navy">
                  Sesión por cerrarse
                </p>
                <p id="idle-desc" className="mt-1 text-sm text-amtme-gray-500">
                  Por seguridad, tu sesión se cerrará por inactividad.
                  {remainingSeconds > 0 && (
                    <span className="ml-1 font-semibold text-amtme-navy">
                      ({remainingSeconds}s)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={keepSession}
                className="flex-1 rounded-lg bg-amtme-navy text-white px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-amtme-navy/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amtme-yellow focus-visible:ring-offset-2"
              >
                Mantener sesión
              </button>
              <button
                onClick={() => void signOutNow()}
                className="rounded-lg border border-black/[0.08] px-4 py-2.5 text-sm font-semibold text-amtme-navy transition-all duration-200 hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amtme-yellow focus-visible:ring-offset-2"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar desktop ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white z-fixed border-r border-black/[0.05]">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-black/[0.05]">
            <h1 className="text-base font-display font-bold text-amtme-navy tracking-tight">
              AMTME Studio
            </h1>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href + '/') && item.href !== '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-amtme-yellow/15 text-amtme-navy font-semibold'
                      : 'text-amtme-gray-600 hover:text-amtme-navy hover:bg-black/[0.03]'
                  )}
                >
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer con logout visible */}
          <div className="px-3 py-4 border-t border-black/[0.05]">
            {authRequired && (
              <button
                onClick={() => void signOut()}
                disabled={signingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-amtme-gray-600 transition-colors duration-200 hover:bg-black/[0.03] hover:text-amtme-navy disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amtme-yellow focus-visible:ring-offset-2"
              >
                <SignOut size={18} weight="regular" />
                {signingOut ? 'Cerrando…' : 'Sesión'}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 md:pl-64 min-h-screen bg-white">
        <div className="h-full px-4 py-6 pb-24 md:pb-6 md:px-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">{children}</div>
        </div>
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────────────── */}
      {mobileItems.length > 0 && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/[0.05] z-fixed">
          <div
            className={cn('gap-1 p-2', {
              'grid grid-cols-5': mobileItems.length === 5,
              'grid grid-cols-4': mobileItems.length === 4,
              'grid grid-cols-3': mobileItems.length === 3,
              'grid grid-cols-2': mobileItems.length === 2,
            })}
          >
            {mobileItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href + '/') && item.href !== '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-2 py-3 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-amtme-yellow/15 text-amtme-navy'
                      : 'text-amtme-gray-600 hover:text-amtme-navy hover:bg-black/[0.03]'
                  )}
                >
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  <span className="text-xs font-semibold line-clamp-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      <GlobalCommandPalette />
    </div>
  );
}
