import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  background?: 'transparent' | 'dark' | 'light';
  border?: 'top' | 'both' | 'none';
  className?: string;
}

export function Section({
  children,
  background = 'transparent',
  border = 'top',
  className = '',
}: SectionProps) {
  const bgClass = {
    transparent: 'bg-transparent',
    dark: 'bg-white/5',
    light: 'bg-white/[0.02]',
  }[background];

  const borderClass = {
    top: 'border-t border-white/10',
    both: 'border-t border-b border-white/10',
    none: '',
  }[border];

  return (
    <section className={`${bgClass} ${borderClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-20">{children}</div>
    </section>
  );
}
