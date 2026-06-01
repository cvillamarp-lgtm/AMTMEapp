import type { ReactNode } from 'react'
import { StudioShell } from '@/components/studio-shell'
import { StudioProvider } from '@/components/studio-provider'
<<<<<<< HEAD
=======

>>>>>>> f04b222 (feat: revision-episodios+checklists+notas Supabase, metricas reportes IA, seeds maestro 25 secciones, 16 checklists)
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <StudioProvider>
      <StudioShell>{children}</StudioShell>
    </StudioProvider>
  )
}
