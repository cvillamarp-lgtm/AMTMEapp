import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  background?: 'transparent' | 'dark' | 'light';
  border?: 'top' | 'both' | 'none';
  className?: string;
  accentBar?: boolean;
}

export function Section({
  children,
  background = 'transparent',
  border = 'top',
  className = '',
  accentBar = false,
}: SectionProps) {
  const bgClass = {
    transparent: 'bg-transparent',
    dark: 'bg-amtme-navy/10',
    light: 'bg-amtme-white/5',
  }[background];

  const borderClass = {
    top: 'border-t border-amtme-yellow/10',
    both: 'border-t border-b border-amtme-yellow/10',
    none: '',
  }[border];

  return (
    <section
      className={`relative ${bgClass} ${borderClass} ${className} ${
        accentBar ? 'pl-1 border-l-4 border-l-amtme-yellow' : ''
      }`}
    >
      <div className="container-amtme py-16 md:py-20 lg:py-24">{children}</div>
    </section>
  );
}
