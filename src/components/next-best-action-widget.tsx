'use client';

import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { NextBestAction } from '@/lib/studio-types';

const severityColors: Record<string, { bg: string; border: string; badge: string }> = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
  },
  medium: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
  },
  low: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
};

export function NextBestActionWidget({ actions }: { actions: NextBestAction[] }) {
  if (!actions || actions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-semibold text-primary mb-2">🎯 Siguiente mejor acción</h2>
        <p className="text-sm text-muted-foreground">No hay acciones críticas en este momento.</p>
      </div>
    );
  }

  const action = actions[0];
  const colors = severityColors[action.severity] || severityColors.low;

  return (
    <div className={cn('rounded-xl border p-6 shadow-sm', colors.border, colors.bg)}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <h2 className="font-semibold text-primary">🎯 Siguiente mejor acción</h2>
        <span className={cn('text-xs font-semibold px-2 py-1 rounded-md capitalize', colors.badge)}>
          {action.severity === 'high'
            ? 'Crítica'
            : action.severity === 'medium'
              ? 'Importante'
              : 'Sugerencia'}
        </span>
      </div>

      <p className="text-sm font-medium text-primary mb-1">{action.title}</p>
      <p className="text-sm text-muted-foreground mb-3">{action.detail}</p>
      <p className="text-xs text-muted-foreground mb-4 italic">{action.reason}</p>

      <Link
        href={action.href}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <span>Ir</span>
        <ArrowRight size={14} weight="bold" />
      </Link>

      {actions.length > 1 && (
        <p className="text-xs text-muted-foreground mt-4">
          +{actions.length - 1} acción(es) más disponible(s)
        </p>
      )}
    </div>
  );
}
