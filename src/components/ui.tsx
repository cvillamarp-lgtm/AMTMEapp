import Link from 'next/link';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { joinClasses } from '@/lib/studio-utils';

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
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}) {
  const base =
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-amtme-navy/25 disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary: 'bg-amtme-navy text-amtme-white hover:bg-amtme-black',
    secondary:
      'bg-semantic-surface text-amtme-navy border border-semantic-border hover:bg-semantic-surface-soft',
    ghost: 'bg-transparent text-amtme-navy hover:bg-amtme-navy/8',
  };

  const classes = joinClasses(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={joinClasses(
        'rounded-[24px] border border-semantic-border bg-semantic-surface p-5 shadow-[0_10px_30px_rgba(12,31,54,0.08)]',
        className
      )}
    >
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'good' | 'warning' | 'danger' | 'accent';
}) {
  const tones = {
    neutral: 'bg-amtme-slate/22 text-amtme-navy',
    good: 'bg-amtme-lemon/30 text-amtme-black',
    warning: 'bg-amtme-lemon text-amtme-black',
    danger: 'bg-amtme-red/12 text-amtme-red',
    accent: 'bg-amtme-lemon text-amtme-navy',
  };

  return (
    <span
      className={joinClasses(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

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
    <label className="flex flex-col gap-2 text-sm text-semantic-text">
      <span className="font-medium">{label}</span>
      {children}
      {hint ? <span className="text-xs text-semantic-muted">{hint}</span> : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={joinClasses(
        'w-full rounded-2xl border border-semantic-border bg-semantic-surface px-4 py-3 text-sm text-semantic-text outline-none placeholder:text-semantic-muted/70 focus:border-amtme-navy/35 focus:ring-2 focus:ring-amtme-navy/15',
        props.className
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={joinClasses(
        'w-full rounded-2xl border border-semantic-border bg-semantic-surface px-4 py-3 text-sm text-semantic-text outline-none placeholder:text-semantic-muted/70 focus:border-amtme-navy/35 focus:ring-2 focus:ring-amtme-navy/15',
        props.className
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={joinClasses(
        'w-full rounded-2xl border border-semantic-border bg-semantic-surface px-4 py-3 text-sm text-semantic-text outline-none focus:border-amtme-navy/35 focus:ring-2 focus:ring-amtme-navy/15',
        props.className
      )}
    />
  );
}
