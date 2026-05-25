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

const navigation = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/documento-maestro', label: 'Documento Maestro' },
  { href: '/episodios', label: 'Episodios' },
  { href: '/creador-visual', label: 'Creador Visual' },
  { href: '/contenido', label: 'Contenido' },
  { href: '/calendario', label: 'Calendario' },
  { href: '/metricas', label: 'Métricas' },
  { href: '/monetizacion', label: 'Monetización' },
  { href: '/automatizacion', label: 'Automatización' },
  { href: '/verificador', label: 'Verificador' },
  { href: '/ia', label: 'IA' },
  { href: '/checklists', label: 'Checklists' },
  { href: '/historico', label: 'Histórico' },
  { href: '/politica-operativa', label: 'Política Operativa' },
  { href: '/configuracion', label: 'Configuración' },
];

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
    <div className="min-h-screen bg-semantic-bg text-semantic-text">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[280px] shrink-0 border-r border-semantic-border bg-semantic-surface px-5 py-6 md:block">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.26em] text-semantic-muted">AMTME</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-amtme-navy">
              Studio OS
            </div>
            <p className="mt-3 text-sm leading-6 text-semantic-muted">
              Sistema operativo editorial y documental con foco en orden, velocidad y control.
            </p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={joinClasses(
                    'flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    active
                      ? 'bg-amtme-navy text-amtme-white shadow-[0_10px_24px_rgba(12,31,54,0.24)]'
                      : 'text-amtme-navy hover:bg-amtme-slate/18'
                  )}
                >
                  <span>{item.label}</span>
                  {active ? <span className="h-2 w-2 rounded-full bg-amtme-lemon" /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[24px] border border-semantic-border bg-semantic-surface-soft p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-semantic-muted">
              Estado del sistema
            </div>
            <div className="mt-2 text-sm font-medium text-amtme-black">Operativo</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="accent">Política activa</Badge>
              <Badge tone="good">Estructura oficial</Badge>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen min-w-0 flex-1 flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-20 mb-5 rounded-[28px] border border-semantic-border bg-semantic-surface px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-semantic-muted">
                  AMTME Studio OS
                </div>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-amtme-navy sm:text-2xl">
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
                    {signingOut ? 'Saliendo...' : 'Cerrar sesión'}
                  </Button>
                ) : null}
              </div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 gap-5">
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-semantic-border bg-semantic-surface px-3 py-2 md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {navigation.slice(0, 6).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={joinClasses(
                  'whitespace-nowrap rounded-full px-3 py-2 text-xs',
                  active ? 'bg-amtme-navy text-amtme-white' : 'bg-amtme-slate/18 text-amtme-navy'
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
