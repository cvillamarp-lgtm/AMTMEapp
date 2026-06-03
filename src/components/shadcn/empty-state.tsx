import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Icon } from '@phosphor-icons/react';

interface EmptyStateProps {
  icon?: Icon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: PhIcon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {PhIcon && <PhIcon size={48} weight="thin" className="text-muted-foreground/30 mb-4" />}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
