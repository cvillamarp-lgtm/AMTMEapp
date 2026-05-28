import { NaturalLanguageEditor } from '@/components/ai-editor/NaturalLanguageEditor';

export default function IAEditorPage() {
  return (
    <div className="space-y-5 pb-24">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">IA / Editor</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-amtme-navy">Editor IA</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-semantic-muted">
          Modifica AMTME Studio OS usando lenguaje natural, con trazabilidad operativa de branch,
          commit, validaciones y rollback.
        </p>
      </div>

      <NaturalLanguageEditor />
    </div>
  );
}
