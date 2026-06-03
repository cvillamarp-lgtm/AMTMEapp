import Link from 'next/link';
import { NaturalLanguageEditor } from '@/components/ai-editor/NaturalLanguageEditor';

export default function IAEditorPage() {
  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
            IA / Editor tecnico
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-amtme-navy">
            Editor tecnico de la app
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-semantic-muted">
            Modifica AMTME Studio OS usando lenguaje natural — cambios de UI, componentes, copy y
            estilos. Con trazabilidad de branch, validaciones y rollback.
          </p>
          <p className="mt-1 text-xs text-semantic-muted">
            Para generar contenido editorial (hooks, guiones, paquetes), usa el{' '}
            <Link href="/ia" className="underline underline-offset-2 hover:no-underline">
              Asistente editorial AMTME
            </Link>
            .
          </p>
        </div>
      </div>

      <NaturalLanguageEditor />
    </div>
  );
}
