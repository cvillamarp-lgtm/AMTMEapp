import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

export function ModulePage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6 pb-24">
      <section className="rounded-[32px] border border-semantic-border bg-semantic-surface px-6 py-7 shadow-[0_16px_50px_rgba(0,31,54,0.1)] sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.24em] text-semantic-muted">{eyebrow}</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-amtme-navy sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-semantic-muted">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </section>
      <div>{children}</div>
    </div>
  );
}

export function TwoColumnLayout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_0.95fr]">
      {left}
      {right}
    </div>
  );
}

export function Surface({ children }: { children: ReactNode }) {
  return <Card className="h-full">{children}</Card>;
}
