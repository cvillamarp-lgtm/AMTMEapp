import { ReactNode } from 'react';
import { Button } from './ui';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
}

export function EmptyState({
  icon = '🌱',
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-semantic-border bg-semantic-surface py-12 text-center">
      <div className="text-5xl mb-4 opacity-80">{icon}</div>
      <h3 className="text-xl font-semibold tracking-tight text-amtme-navy">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-amtme-slate leading-relaxed">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {action && (
            <Button href={action.href} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              href={secondaryAction.href}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
