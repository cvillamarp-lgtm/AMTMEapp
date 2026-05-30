import { generateWithProvider } from '@/lib/ai-providers';
import type { AIProvider } from '@/lib/studio-types';
import type { AiEditorMode, AiEditorScope, RiskLevel } from './types';
import { detectBlockedAction } from './types';
import { resolveAffectedFiles, assessRisk } from './fileResolver';

export interface ParsedIntent {
  intent: string;
  summary: string;
  affectedFiles: string[];
  affectedRoutes: string[];
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  confidence: number; // 0-100, how confident the LLM is
  reasoning: string; // short explanation from the model
}

/**
 * Uses real LLM to deeply understand natural language instructions for the Studio OS editor.
 * This is the key upgrade to make the experience feel genuinely Lovable-style.
 */
export async function parseInstructionWithLLM(
  prompt: string,
  mode: AiEditorMode,
  scope: AiEditorScope,
  provider: AIProvider = 'grok'
): Promise<ParsedIntent> {
  // Hard safety net first
  const blocked = detectBlockedAction(prompt);
  if (blocked.blocked) {
    return {
      intent: 'blocked',
      summary: blocked.reason ?? 'Acción bloqueada por política de seguridad.',
      affectedFiles: [],
      affectedRoutes: [],
      riskLevel: 'blocked',
      requiresApproval: true,
      confidence: 100,
      reasoning: 'Matched security blocklist.',
    };
  }

  const systemPrompt = `You are an expert senior full-stack engineer and product architect for "AMTME Studio OS", an internal editorial and operational system for a high-quality podcast/content brand.

Your job is to analyze a user's natural language instruction and return a precise, structured plan.

Return ONLY valid JSON with this exact shape (no markdown, no extra text):

{
  "intent": string,                  // short machine-friendly intent (e.g. "improve_ui", "add_feature", "update_copy", "refine_styles", "compact_layout", "update_data")
  "summary": string,                 // clear one-sentence human summary of what the user wants
  "affectedRoutes": string[],        // which main sections/pages this affects (e.g. ["/dashboard", "/ia/editor"])
  "riskLevel": "low" | "medium" | "high" | "critical",
  "requiresApproval": boolean,
  "confidence": number,              // 0-100
  "reasoning": string                // 1-2 sentences explaining why you chose this risk and these files
}

Rules:
- Be conservative on risk. Touching layout, globals.css, studio-shell, core providers, or anything security-related = at least "high".
- If the request is vague, still try to be useful but lower confidence.
- Never suggest deleting files or routes.
- "requiresApproval" should be true unless the change is obviously low-risk and the mode is not "safe".

Current available top-level routes in the app:
- /dashboard
- /documento-maestro
- /episodios
- /contenido
- /calendario
- /metricas
- /monetizacion
- /automatizacion
- /ia + /ia/editor
- /creador-visual
- /verificador
- /checklists
- /historico
- /politica-operativa
- /configuracion

User instruction:
"""${prompt}"""

Scope chosen by user: ${scope}
Execution mode chosen by user: ${mode}
`;

  try {
    const raw = await generateWithProvider({
      provider,
      prompt: `Analyze this instruction carefully and return the JSON plan.`,
      systemPrompt,
    });

    const parsed = safeJsonParse(raw) as Record<string, unknown>;

    // Merge with our static file resolver for safety
    const staticResolution = resolveAffectedFiles(prompt, scope);
    const risk = assessRisk(
      staticResolution.files,
      parsed.riskLevel as RiskLevel | undefined,
      prompt
    );

    return {
      intent: (parsed.intent as string) || 'general_modification',
      summary: (parsed.summary as string) || prompt.slice(0, 140),
      affectedFiles: [
        ...new Set([...((parsed.affectedFiles as string[]) || []), ...staticResolution.files]),
      ],
      affectedRoutes: [
        ...new Set([...((parsed.affectedRoutes as string[]) || []), ...staticResolution.routes]),
      ],
      riskLevel: risk,
      requiresApproval:
        mode === 'safe' ? true : ((parsed.requiresApproval as boolean) ?? risk !== 'low'),
      confidence: Math.max(30, Math.min(95, (parsed.confidence as number) ?? 60)),
      reasoning: (parsed.reasoning as string) || 'LLM analysis + static safety resolver.',
    };
  } catch {
    // Graceful fallback to the original keyword-based parser
    const fallback = parseInstructionFallback(prompt, mode, scope);
    return {
      ...fallback,
      confidence: 35,
      reasoning: 'LLM call failed — fell back to keyword analysis for safety.',
    };
  }
}

function safeJsonParse(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in LLM response');
    return JSON.parse(match[0]);
  }
}

// Fallback to the original (safer, keyword-based) implementation
function parseInstructionFallback(prompt: string, mode: AiEditorMode, scope: AiEditorScope) {
  const blocked = detectBlockedAction(prompt);
  if (blocked.blocked) {
    return {
      intent: 'blocked',
      summary: blocked.reason ?? 'Acción bloqueada.',
      affectedFiles: [],
      affectedRoutes: [],
      riskLevel: 'blocked' as const,
      requiresApproval: true,
      confidence: 100,
      reasoning: 'Security blocklist match.',
    };
  }

  const { files, routes } = resolveAffectedFiles(prompt, scope);
  const riskLevel = assessRisk(files, undefined, prompt);
  const requiresApproval = mode !== 'safe' ? riskLevel !== 'low' || mode === 'direct' : true;

  return {
    intent: 'general_modification',
    summary: `Instrucción: "${prompt.slice(0, 80)}${prompt.length > 80 ? '...' : ''}"`,
    affectedFiles: files,
    affectedRoutes: routes,
    riskLevel,
    requiresApproval,
    confidence: 45,
    reasoning: 'Keyword-based fallback analysis.',
  };
}
