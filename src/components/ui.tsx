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
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0C1F36]/30',
    'disabled:pointer-events-none disabled:opacity-40',
  ].join(' ');

  const variants: Record<string, string> = {
    primary:
      'bg-[#0C1F36] text-white hover:bg-[#09182a] active:scale-[0.97] shadow-[0_1px_3px_rgba(12,31,54,0.18)]',
    secondary: 'bg-black/[0.06] text-[#0C1F36] hover:bg-black/[0.10] active:scale-[0.97]',
    ghost: 'bg-transparent text-[#0C1F36] hover:bg-black/[0.05] active:scale-[0.97]',
    danger: 'bg-[#E0211E] text-white hover:bg-[#c01c1a] active:scale-[0.97]',
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
        'shadow-[0_2px_8px_rgba(12,31,54,0.06),0_0_1px_rgba(12,31,54,0.06)]',
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
    neutral: 'bg-black/[0.06] text-[#0C1F36]',
    good: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-[#FEE94B] text-[#0C1F36]',
    danger: 'bg-red-50 text-[#C0201E]',
    accent: 'bg-[#FEE94B] text-[#0C1F36]',
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
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0C1F36]/50">
        {label}
      </span>
      {children}
      {hint ? <span className="text-[11px] text-[#6B7B8C]">{hint}</span> : null}
    </label>
  );
}

// ─── Inputs ──────────────────────────────────────────────────────────────────────
const inputBase = [
  'w-full rounded-xl border border-black/[0.10] bg-black/[0.025]',
  'px-3.5 py-2.5 text-[14px] text-[#0C1F36]',
  'placeholder:text-[#6B7B8C]/60',
  'outline-none transition-all duration-150',
  'focus:border-[#0C1F36]/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(12,31,54,0.08)]',
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
