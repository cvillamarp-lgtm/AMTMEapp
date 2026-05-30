import { NaturalLanguageEditor } from '@/components/ai-editor/NaturalLanguageEditor';

export default function IAEditorPage() {
  return (
    <div className="space-y-5 pb-24">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">IA / Editor</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-amtme-navy">Editor IA</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-semantic-muted">
          Dile a AMTMEapp qué necesitas cambiar. Escribe una instrucción normal. El editor analizará
          la app, propondrá cambios seguros, mostrará el plan y solo aplicará modificaciones cuando
          tú lo confirmes.
        </p>
      </div>
      <NaturalLanguageEditor />
    </div>
  );
}
