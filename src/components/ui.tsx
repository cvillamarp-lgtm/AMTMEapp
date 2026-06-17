import Link from 'next/link';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { joinClasses } from '@/lib/studio-utils';

// ─── Button ─ Contraste WCAG AA garantizado en todas las variantes ─────────────
export function Button({
  children,
  className,
  variant = 'primary',
  href,
  type = 'button',
  onClick,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}) {
  const base = [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap select-none cursor-pointer',
    'rounded-xl px-4 py-2 text-[13px] font-semibold leading-none tracking-[-0.01em]',
    'transition-all duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amtme-navy/30',
    'disabled:pointer-events-none disabled:opacity-40',
  ].join(' ');

  const variants: Record<string, string> = {
    primary:
      'bg-amtme-navy text-white hover:bg-amtme-navy/80 active:scale-[0.97] shadow-[0_1px_3px_rgba(12,31,54,0.18)]',
    secondary: 'bg-black/[0.06] text-amtme-navy hover:bg-black/[0.10] active:scale-[0.97]',
    ghost: 'bg-transparent text-amtme-navy hover:bg-black/[0.05] active:scale-[0.97]',
    danger: 'bg-amtme-red text-white hover:bg-amtme-red/80 active:scale-[0.97]',
  };

  const classes = joinClasses(base, variants[variant], className);

  if (href)
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────────
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={joinClasses(
        'rounded-[20px] border border-black/[0.07] bg-white p-6',
        'shadow-sm',
        className
      )}
    >
      {children}
    </section>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────────
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'good' | 'warning' | 'danger' | 'accent';
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-black/[0.06] text-amtme-navy',
    good: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amtme-yellow text-amtme-navy',
    danger: 'bg-red-50 text-red-700',
    accent: 'bg-amtme-yellow text-amtme-navy',
  };

  return (
    <span
      className={joinClasses(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[-0.005em]',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────────
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-amtme-navy/50">
        {label}
      </span>
      {children}
      {hint ? <span className="text-[11px] text-amtme-gray-500">{hint}</span> : null}
    </label>
  );
}

// ─── Inputs ──────────────────────────────────────────────────────────────────────
const inputBase = [
  'w-full rounded-xl border border-black/[0.10] bg-black/[0.025]',
  'px-3.5 py-2.5 text-[14px] text-amtme-navy',
  'placeholder:text-amtme-gray-500/60',
  'outline-none transition-all duration-150',
  'focus:border-amtme-navy/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(12,31,54,0.08)]',
  'disabled:opacity-50',
].join(' ');

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={joinClasses(inputBase, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={joinClasses(inputBase, 'resize-y min-h-[80px]', props.className)}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={joinClasses(inputBase, 'cursor-pointer', props.className)} />
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={joinClasses('h-px bg-black/[0.07] my-4', className)} />;
}

// ─── PageHeader ──────────────────────────────────────────────────────────────────
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-amtme-border bg-amtme-navy/30 px-6 py-7 shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="text-xs uppercase tracking-[0.24em] text-amtme-muted">{eyebrow}</div>
          )}
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-amtme-yellow sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 max-w-2xl text-base leading-7 text-amtme-gray-400">{description}</p>
          )}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-amtme-border/40 bg-amtme-navy/20 px-6 py-12 text-center">
      {icon && <div className="mb-4 text-3xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-amtme-white">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-amtme-gray-400">{description}</p>}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {action && (
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" href={secondaryAction.href}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── LoadingSkeleton ─────────────────────────────────────────────────────────────
export function LoadingSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={joinClasses('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 animate-pulse rounded bg-amtme-border" />
      ))}
    </div>
  );
}

// ─── ErrorState ──────────────────────────────────────────────────────────────────
export function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-start rounded-lg border border-amtme-red/30 bg-amtme-red/10 px-6 py-4">
      <h3 className="font-semibold text-amtme-red">{title}</h3>
      {description && <p className="mt-1 text-sm text-amtme-red/80">{description}</p>}
      {action && (
        <Button variant="danger" onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ─── StatusBadge ────────────────────────────────────────────────────────────────
export function StatusBadge({
  status,
}: {
  status:
    | 'Idea'
    | 'En investigación'
    | 'Guion'
    | 'Grabación'
    | 'Edición'
    | 'Publicado'
    | 'Distribuido'
    | 'Medido'
    | 'Archivado'
    | 'Borrador'
    | 'Listo'
    | 'Pagado'
    | 'Perdido';
}) {
  const statusColor: Record<typeof status, string> = {
    Idea: 'bg-amtme-gray-200/20 text-amtme-gray-400',
    'En investigación': 'bg-amtme-info/20 text-amtme-info',
    Guion: 'bg-amtme-yellow/20 text-amtme-yellow',
    Grabación: 'bg-amtme-warning/20 text-amtme-warning',
    Edición: 'bg-amtme-yellow/30 text-amtme-yellow',
    Publicado: 'bg-amtme-success/20 text-amtme-success',
    Distribuido: 'bg-amtme-info/20 text-amtme-info',
    Medido: 'bg-amtme-success/20 text-amtme-success',
    Archivado: 'bg-amtme-gray-300/30 text-amtme-gray-300',
    Borrador: 'bg-amtme-gray-200/20 text-amtme-gray-400',
    Listo: 'bg-amtme-success/20 text-amtme-success',
    Pagado: 'bg-amtme-success/20 text-amtme-success',
    Perdido: 'bg-amtme-gray-300/30 text-amtme-gray-300',
  };

  return (
    <span
      className={joinClasses(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        statusColor[status]
      )}
    >
      {status}
    </span>
  );
}
