import { NaturalLanguageEditor } from '@/components/ai-editor/NaturalLanguageEditor';

export default function IAEditorPage() {
  return (
    <div className="max-w-4xl space-y-8 pb-24">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-amtme-slate">
          IA • Asistente Conversacional
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tighter text-amtme-navy">Editor IA</h1>
        <p className="mt-3 max-w-2xl text-lg text-amtme-slate leading-relaxed">
          Describe en lenguaje natural lo que quieres cambiar en AMTME Studio OS. La IA analiza tu
          intención, evalúa el riesgo, genera un plan seguro y te muestra exactamente qué va a pasar
          antes de tocar nada.
        </p>
      </div>

      {/* Capabilities highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl border border-semantic-border bg-semantic-surface p-4">
          <div className="font-medium text-amtme-navy">Entiende lenguaje natural</div>
          <div className="text-amtme-slate mt-1 text-sm">
            Escribe como hablarías con un diseñador o developer senior.
          </div>
        </div>
        <div className="rounded-2xl border border-semantic-border bg-semantic-surface p-4">
          <div className="font-medium text-amtme-navy">Muestra el razonamiento</div>
          <div className="text-amtme-slate mt-1 text-sm">
            Ves por qué propone cada cambio y qué nivel de riesgo tiene.
          </div>
        </div>
        <div className="rounded-2xl border border-semantic-border bg-semantic-surface p-4">
          <div className="font-medium text-amtme-navy">Nunca aplica sin ti</div>
          <div className="text-amtme-slate mt-1 text-sm">
            Siempre ves el plan completo + diff antes de confirmar.
          </div>
        </div>
      </div>

      <NaturalLanguageEditor />
    </div>
  );
}
