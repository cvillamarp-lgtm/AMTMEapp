'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
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
  Lightbulb,
  CaretRight,
  CaretLeft,
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
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) setCollapsed(stored === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
    <div className="flex min-h-screen bg-background font-sans">
      {/* ── Banner de inactividad ────────────────────────────────────────── */}
      {showWarning && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="idle-title"
          aria-describedby="idle-desc"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <Warning size={22} weight="fill" className="mt-0.5 shrink-0 text-amber-500" />
              <div>
                <p id="idle-title" className="text-sm font-semibold text-amtme-navy">
                  Sesión por cerrarse
                </p>
                <p id="idle-desc" className="mt-1 text-sm text-amtme-slate">
                  Por seguridad, tu sesión se cerrará por inactividad.
                  {remainingSeconds > 0 && (
                    <span className="ml-1 font-medium text-amtme-navy">({remainingSeconds}s)</span>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={keepSession}
                className="flex-1 rounded-xl bg-amtme-navy px-4 py-2.5 text-sm font-semibold text-amtme-white transition hover:bg-opacity-90"
              >
                Mantener sesión
              </button>
              <button
                onClick={() => void signOutNow()}
                className="rounded-xl border border-amtme-red/30 px-4 py-2.5 text-sm font-semibold text-amtme-red transition hover:bg-amtme-red/8"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar desktop ─────────────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-amtme-navy z-30 transition-all duration-200',
          collapsed ? 'md:w-16' : 'md:w-64'
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo + toggle */}
          <div className="flex items-center justify-between h-16 px-3 border-b border-white/10 shrink-0">
            {!collapsed && (
              <h1 className="text-base font-semibold text-white tracking-tight truncate px-2">
                AMTME Studio OS
              </h1>
            )}
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              title={collapsed ? 'Expandir sidebar (Ctrl+B)' : 'Colapsar sidebar (Ctrl+B)'}
            >
              {collapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-4 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href + '/') && item.href !== '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md transition-colors',
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                    'text-sm font-medium',
                    isActive
                      ? 'bg-amtme-lemon text-amtme-navy'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon size={20} weight="regular" className="shrink-0" />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer con logout visible */}
          <div className="px-2 py-4 border-t border-white/10 shrink-0">
            {authRequired && (
              <button
                onClick={() => void signOut()}
                disabled={signingOut}
                title={collapsed ? (signingOut ? 'Cerrando sesión…' : 'Cerrar sesión') : undefined}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40',
                  collapsed ? 'justify-center px-2' : 'px-3'
                )}
              >
                <SignOut size={18} weight="regular" className="shrink-0" />
                {!collapsed && (signingOut ? 'Cerrando sesión…' : 'Cerrar sesión')}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main
        className={cn(
          'flex-1 min-h-screen transition-all duration-200',
          collapsed ? 'md:pl-16' : 'md:pl-64'
        )}
      >
        <div className="h-full p-6 pb-24 md:pb-6">{children}</div>
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────────────── */}
      {mobileItems.length > 0 && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-amtme-navy border-t border-white/10 z-50">
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
                    'flex flex-col items-center gap-1 px-2 py-2 rounded-md transition-colors',
                    isActive ? 'bg-amtme-lemon text-amtme-navy' : 'text-white/70'
                  )}
                >
                  <Icon size={20} weight="regular" />
                  <span className="text-xs font-medium">{item.label}</span>
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
