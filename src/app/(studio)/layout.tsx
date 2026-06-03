import type { ReactNode } from 'react';
import { StudioShell } from '@/components/studio-shell';
import { StudioProvider } from '@/components/studio-provider';

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <StudioProvider>
      <StudioShell>{children}</StudioShell>
    </StudioProvider>
  );
}
