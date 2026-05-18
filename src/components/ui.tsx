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
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#001F36]/20 disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary: 'bg-[#001F36] text-white hover:bg-[#003D5C]',
    secondary: 'bg-white text-[#001F36] border border-black/10 hover:bg-[#F5EFE6]',
    ghost: 'bg-transparent text-[#001F36] hover:bg-black/5',
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
        'rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_10px_30px_rgba(0,31,54,0.05)]',
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
    neutral: 'bg-black/5 text-[#001F36]',
    good: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    accent: 'bg-[#E8FF40] text-[#001F36]',
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
    <label className="flex flex-col gap-2 text-sm text-[#001F36]">
      <span className="font-medium">{label}</span>
      {children}
      {hint ? <span className="text-xs text-black/50">{hint}</span> : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={joinClasses(
        'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#001F36] outline-none placeholder:text-black/30 focus:border-[#001F36]/30 focus:ring-2 focus:ring-[#001F36]/10',
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
        'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#001F36] outline-none placeholder:text-black/30 focus:border-[#001F36]/30 focus:ring-2 focus:ring-[#001F36]/10',
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
        'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#001F36] outline-none focus:border-[#001F36]/30 focus:ring-2 focus:ring-[#001F36]/10',
        props.className
      )}
    />
  );
}
