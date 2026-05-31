'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { useStudio } from '@/components/studio-provider';
import { Badge, Button } from '@/components/ui';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';
import { isAuthRequired } from '@/lib/supabase/env';
import { joinClasses } from '@/lib/studio-utils';
import { runStudioVerification } from '@/lib/studio-verifier';

const navigationGroups = [
  {
    label: 'Editorial',
    items: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/documento-maestro', label: 'Documento Maestro' },
      { href: '/episodios', label: 'Episodios' },
      { href: '/contenido', label: 'Contenido' },
      { href: '/creador-visual', label: 'Creador Visual' },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { href: '/calendario', label: 'Calendario' },
      { href: '/metricas', label: 'Métricas' },
      { href: '/monetizacion', label: 'Monetización' },
      { href: '/checklists', label: 'Checklists' },
    ],
  },
  {
    label: 'IA & Herramientas',
    items: [
      { href: '/ia', label: 'IA' },
      { href: '/ia/editor', label: 'Editor IA' },
      { href: '/automatizacion', label: 'Automatización' },
      { href: '/verificador', label: 'Verificador' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/historico', label: 'Histórico' },
      { href: '/politica-operativa', label: 'Política Operativa' },
      { href: '/configuracion', label: 'Configuración' },
    ],
  },
];

function NavIcon({ href }: { href: string }) {
  const paths: Record<string, ReactNode> = {
    '/dashboard': (
      <>
        <path d="M4 4h7v7H4z" />
        <path d="M13 4h7v5h-7z" />
        <path d="M13 11h7v9h-7z" />
        <path d="M4 13h7v7H4z" />
      </>
    ),
    '/documento-maestro': (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 12h6" />
      </>
    ),
    '/checklists': (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 12h6" />
      </>
    ),
    '/politica-operativa': (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 12h6" />
      </>
    ),
    '/episodios': (
      <>
        <path d="M4 7h16v10H4z" />
        <path d="m10 10 5 2-5 2z" />
      </>
    ),
    '/contenido': (
      <>
        <path d="M4 7h16v10H4z" />
        <path d="m10 10 5 2-5 2z" />
      </>
    ),
    '/ia': (
      <>
        <path d="M4 7h16v10H4z" />
        <path d="m10 10 5 2-5 2z" />
      </>
    ),
    '/ia/editor': (
      <>
        <path d="M4 7h16v10H4z" />
        <path d="m10 10 5 2-5 2z" />
      </>
    ),
    '/metricas': (
      <>
        <path d="M5 19h14" />
        <path d="M7 16v-4" />
        <path d="M12 16V8" />
        <path d="M17 16v-6" />
      </>
    ),
    '/monetizacion': (
      <>
        <path d="M5 19h14" />
        <path d="M7 16v-4" />
        <path d="M12 16V8" />
        <path d="M17 16v-6" />
      </>
    ),
    '/historico': (
      <>
        <path d="M5 19h14" />
        <path d="M7 16v-4" />
        <path d="M12 16V8" />
        <path d="M17 16v-6" />
      </>
    ),
    '/calendario': (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
    '/automatizacion': (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
    '/verificador': (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
  };
  const icon = paths[href] ?? (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" />
    </>
  );
  return (
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useStudio();
  const authRequired = useMemo(() => isAuthRequired(), []);
  const [signingOut, setSigningOut] = useState(false);
  const verification = runStudioVerification(state);

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
    <div className="min-h-screen bg-[#F5F1E8] text-[#0C1F36]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="hidden w-60 shrink-0 border-r border-black/[0.07] bg-[#FAFAF8] px-4 py-7 md:flex md:flex-col">
          {/* Logo */}
          <div className="mb-8 px-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6B7B8C]">
              AMTME
            </div>
            <div className="mt-1.5 text-xl font-bold tracking-tight text-[#0C1F36]">Studio OS</div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-5 overflow-y-auto">
            {navigationGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B7B8C]/70">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={joinClasses(
                          'flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150',
                          active
                            ? 'bg-[#0C1F36] text-white shadow-[0_4px_12px_rgba(12,31,54,0.20)]'
                            : 'text-[#0C1F36] hover:bg-black/[0.05]'
                        )}
                      >
                        <NavIcon href={item.href} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Estado del sistema */}
          <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B7B8C]">
              Sistema
            </div>
            <div className="mt-1.5 text-sm font-semibold text-[#0C1F36]">Operativo</div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Badge tone="accent">Política activa</Badge>
              <Badge tone="neutral">Estructura oficial</Badge>
            </div>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────────────── */}
        <main className="flex min-h-screen min-w-0 flex-1 flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header
            className="sticky top-0 z-20 mb-6 rounded-[20px] border border-black/[0.07] bg-white/90 px-5 py-3.5 backdrop-blur-md sm:px-6
            shadow-[0_2px_8px_rgba(12,31,54,0.06)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6B7B8C]">
                  AMTME Studio OS
                </div>
                <h1 className="mt-0.5 text-lg font-bold tracking-tight text-[#0C1F36]">
                  {state.config.projectName}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">Paleta bloqueada</Badge>
                <Badge tone="neutral">Fuente de verdad central</Badge>
                <Badge
                  tone={
                    verification.score >= 85
                      ? 'good'
                      : verification.score >= 70
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {verification.passedChecks}/{verification.totalChecks} checks OK
                </Badge>
                {authRequired ? (
                  <Button variant="secondary" onClick={signOut} disabled={signingOut}>
                    {signingOut ? 'Saliendo…' : 'Cerrar sesión'}
                  </Button>
                ) : null}
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1">{children}</div>
        </main>
      </div>

      {/* ── Mobile bottom nav ──────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.07] bg-white/95 px-3 py-2 backdrop-blur-md md:hidden">
        <div className="flex gap-1.5 overflow-x-auto">
          {navigationGroups
            .flatMap((g) => g.items)
            .slice(0, 6)
            .map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={joinClasses(
                    'whitespace-nowrap rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-150',
                    active ? 'bg-[#0C1F36] text-white' : 'text-[#0C1F36] hover:bg-black/[0.05]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
        </div>
      </nav>
    </div>
  );
}
