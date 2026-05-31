'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: 'default' | 'editorial';
}

export function EmptyState({ icon, title, description, action, tone = 'editorial' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-black/8 bg-white px-8 py-14 text-center">
      {icon && <div className="mb-4 text-[#FEE94B]">{icon}</div>}
      <h3 className="text-xl font-semibold tracking-tight text-[#0C1F36]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-black/55">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
