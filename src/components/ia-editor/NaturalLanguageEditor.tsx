'use client';

import { useState } from 'react';
import { useEditorSession } from '@/hooks/useEditorSession';
import { analyzeInstruction } from '@/lib/ia-editor/intentAnalyzer';
import { createProposalDraft, createReasoningTrace } from '@/lib/ia-editor/types';
import type { Proposal } from '@/lib/ia-editor/types';
import { ReasoningDisclosure } from './ReasoningDisclosure';
import { RiskLevelBadge } from './RiskLevelBadge';
import type { AIProvider } from '@/lib/studio-types';

/**
 * NaturalLanguageEditor - Lovable-style conversational IA for AMTME Studio
 * 
 * This is the heart of the new experience.
 * User types in Spanish → we show visible model reasoning at every step.
 */
export function NaturalLanguageEditor() {
  const { state, actions } = useEditorSession();
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<AIProvider>('grok');
  const [isProcessing, setIsProcessing] = useState(false);
  const [highRiskConfirmed, setHighRiskConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setHighRiskConfirmed(false);
    setIsProcessing(true);
    actions.startThinking(input.trim());

    try {
      const result = await analyzeInstruction({
        provider,
        instruction: input.trim(),
      });

      actions.receivePlan(result.intentAnalysis, result.plan);

      // Guardrail or high-risk: explicit confirmation gate with visible reasoning
      if (result.overallRisk === 'alto' || result.plan.some(p => p.risk === 'alto')) {
        actions.requestConfirmation();
      }
    } catch (err: any) {
      actions.fail(err.message || 'Error analizando la instrucción');
    } finally {
      setIsProcessing(false);
    }
  };

  // Pure builder: always creates immutable Proposal with full visible reasoning traces (Fase 1 contract)
  function buildProposalFromCurrent(): Proposal | null {
    if (!state.intentAnalysis || state.plan.length === 0) return null;

    const trace = createReasoningTrace({
      model: provider,
      reasoning: state.intentAnalysis.reasoning,
      confidence: state.intentAnalysis.confidence,
    });

    // Include additional trace for the plan aggregation (guarantees visible reasoning everywhere)
    const planTrace = createReasoningTrace({
      model: provider,
      reasoning: `Plan generado con ${state.plan.length} cambios. Riesgo overall detectado vía guardrails + keywords + modelo. Simulación segura activada (simulationOnly=true). Ningún cambio real se aplica.`,
      confidence: Math.min(0.95, state.intentAnalysis.confidence + 0.05),
    });

    return createProposalDraft({
      instruction: state.instruction,
      intentAnalysis: state.intentAnalysis,
      plan: state.plan,
      reasoningTrace: [trace, planTrace],
      userId: 'studio-user',
    });
  }

  return (
    <div className="space-y-6">
      {/* Input area - conversational */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="text-xs uppercase tracking-[0.2em] text-black/40">Editor Conversacional IA</div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Ej: "mejora esta página de episodios con un empty state más humano y premium"'
          className="w-full min-h-[100px] rounded-3xl border border-black/10 bg-white p-5 text-base placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-[#FEE94B]"
          disabled={isProcessing}
        />
        <div className="flex items-center gap-3">
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm"
          >
            <option value="grok">Grok</option>
            <option value="gemini">Gemini</option>
          </select>
          <button 
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="rounded-2xl bg-[#0C1F36] px-8 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {isProcessing ? 'Pensando…' : 'Enviar instrucción'}
          </button>
        </div>
      </form>

      {/* Thinking state with visible reasoning placeholder */}
      {state.phase === 'thinking' && (
        <div className="rounded-3xl border border-black/10 bg-[#F5F1E8] p-6">
          <div className="text-sm text-black/60">Analizando tu instrucción con el modelo…</div>
          <div className="mt-2 text-xs text-black/40">Mostraremos el razonamiento completo del modelo en el siguiente paso.</div>
        </div>
      )}

      {/* Plan ready + visible reasoning */}
      {state.phase === 'plan-ready' && state.intentAnalysis && (
        <div className="space-y-4 rounded-3xl border border-black/10 bg-white p-6">
          <div>
            <div className="text-xs text-black/40">LO QUE ENTENDIÓ EL MODELO</div>
            <div className="mt-1 text-lg font-medium">{state.intentAnalysis.intent}</div>
          </div>

          <ReasoningDisclosure 
            reasoning={state.intentAnalysis.reasoning} 
            confidence={state.intentAnalysis.confidence}
          />

          <div>
            <div className="text-xs uppercase tracking-widest text-black/40 mb-2">PLAN DE CAMBIOS PROPUESTO</div>
            <ul className="space-y-2">
              {state.plan.map((item, i) => (
                <li key={i} className="flex gap-3 rounded-2xl border border-black/8 p-4 text-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.module}:</span> {item.description}
                      <RiskLevelBadge risk={item.risk} />
                    </div>
                    <div className="mt-2 text-xs text-black/60">{item.reasoning}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => {
              // For low/medium risk: directly build immutable Proposal + simulate apply (full flow)
              const proposal = buildProposalFromCurrent();
              if (proposal) {
                actions.applySimulation(proposal);
                actions.completeSuccess(proposal);
              } else {
                actions.fail('Error creando la propuesta con trazas de razonamiento');
              }
            }}
            className="mt-4 w-full rounded-2xl bg-[#0C1F36] py-3 text-sm font-medium text-white"
          >
            Aplicar simulación segura (revisar plan + razonamiento arriba)
          </button>
        </div>
      )}

      {/* High-risk confirmation gate showing full reasoning + proper checkbox + real immutable Proposal creation */}
      {state.phase === 'confirming-high-risk' && state.intentAnalysis && (
        <div className="rounded-3xl border-2 border-[#E0211E] bg-white p-6">
          <div className="font-semibold text-[#E0211E]">ALTO RIESGO / GUARDRAIL DETECTADO</div>
          <div className="mt-2 text-sm text-black/70">Revisa el razonamiento visible completo del modelo antes de confirmar. Solo simulación segura (nunca muta nada real).</div>
          
          <div className="mt-4">
            <ReasoningDisclosure reasoning={state.intentAnalysis.reasoning} confidence={state.intentAnalysis.confidence} />
          </div>

          <label className="mt-4 flex items-start gap-2 text-sm cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={highRiskConfirmed} 
              onChange={(e) => setHighRiskConfirmed(e.target.checked)} 
              className="mt-1 accent-[#E0211E]" 
            />
            <span>He leído y entendido el razonamiento del modelo y los guardrails de seguridad. Procedo solo en modo simulación.</span>
          </label>

          <button 
            onClick={() => {
              const proposal = buildProposalFromCurrent();
              if (proposal) {
                actions.applySimulation(proposal);
                actions.completeSuccess(proposal);
                setHighRiskConfirmed(false);
              } else {
                actions.fail('No se pudo crear la Proposal inmutable (verifica datos del plan)');
              }
            }}
            disabled={!highRiskConfirmed}
            className="mt-4 w-full rounded-2xl bg-[#E0211E] py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            Confirmar y APLICAR SIMULACIÓN (sin cambios reales)
          </button>
        </div>
      )}

      {/* Success + simulation banner with FULL visible reasoning + plan details (core Lovable experience) */}
      {state.phase === 'success' && state.currentProposal && (
        <div className="space-y-4 rounded-3xl border border-[#FEE94B] bg-[#F5F1E8] p-6">
          <div>
            <div className="font-semibold text-[#0C1F36]">✓ Simulación aplicada correctamente (simulationOnly=true)</div>
            <div className="mt-1 text-sm text-black/60">Instrucción: “{state.currentProposal.instruction}”. Ningún dato real fue modificado. Todo es preview seguro.</div>
          </div>

          {/* All reasoning traces visible for trust */}
          <div className="space-y-2">
            {state.currentProposal.reasoningTrace.map((t, idx) => (
              <ReasoningDisclosure 
                key={t.id || idx}
                reasoning={t.reasoning} 
                model={t.model}
                confidence={t.confidence}
                compact={idx > 0}
              />
            ))}
          </div>

          {/* Applied plan recap with risk badges */}
          <div>
            <div className="text-xs uppercase tracking-widest text-black/40 mb-2">CAMBIOS SIMULADOS</div>
            <ul className="space-y-1 text-sm">
              {state.currentProposal.plan.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <RiskLevelBadge risk={item.risk} /> <span className="font-medium">{item.module}:</span> {item.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={actions.reset} className="flex-1 rounded-2xl border border-black/20 py-2.5 text-sm font-medium">Nueva instrucción</button>
            <button
              onClick={() => {
                if (state.currentProposal) {
                  const text = `Instrucción: ${state.currentProposal.instruction}\n\nCambios simulados:\n${state.currentProposal.plan.map(item => `• ${item.module}: ${item.description}`).join('\n')}`;
                  navigator.clipboard.writeText(text);
                }
              }}
              className="rounded-2xl border border-black/20 px-5 py-2.5 text-sm font-medium"
            >
              Copiar
            </button>
            <button 
              onClick={() => {
                if (state.currentProposal) {
                  const rbTrace = createReasoningTrace({
                    model: provider,
                    reasoning: `Rollback de la propuesta ${state.currentProposal.id}. El usuario solicitó deshacer la simulación. Se marca estado rolled_back. Historial preserva ambas para auditoría completa.`,
                    confidence: 0.98,
                  });
                  const rollbackProposal: Proposal = {
                    ...state.currentProposal,
                    id: `rollback-${Date.now()}`,
                    status: 'rolled_back',
                    reasoningTrace: [...state.currentProposal.reasoningTrace, rbTrace],
                    createdAt: new Date().toISOString(),
                  };
                  actions.rollback(rollbackProposal);
                }
              }} 
              className="flex-1 rounded-2xl bg-[#0C1F36] py-2.5 text-sm font-medium text-white"
            >
              Deshacer (rollback con traza)
            </button>
          </div>
        </div>
      )}

      {/* History view (partial for core flow; full persistence + dedicated view later) — uses DS components */}
      {state.history.length > 0 && (
        <div className="rounded-3xl border border-black/10 bg-white p-5 space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-black/40">Historial de propuestas (sesión actual)</div>
          {state.history.slice().reverse().map((p, idx) => (
            <div key={p.id} className="text-sm border-l-2 pl-3 border-black/10">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-black/40">{p.id.slice(0,8)}</span>
                <span className="font-medium">{p.instruction.slice(0,60)}{p.instruction.length>60?'…':''}</span>
                <span className={`text-[10px] px-1.5 py-px rounded ${p.status==='rolled_back' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{p.status}</span>
              </div>
              <div className="text-xs text-black/60 mt-0.5">Riesgos: {p.plan.map(i=>i.risk).join(', ')} · {p.reasoningTrace.length} trazas de razonamiento</div>
            </div>
          ))}
          <div className="text-[10px] text-black/40">Las propuestas se persisten en Supabase ai_history (jsonb) + local en flujos completos.</div>
        </div>
      )}

      {state.phase === 'error' && (
        <div className="rounded-3xl border border-[#E0211E] p-4 text-sm text-[#E0211E]">
          {state.error}
        </div>
      )}
    </div>
  );
}
