import type { DiffHunk, AiEditorMode } from './types';

// ── Generate a structured diff proposal ───────────────────────────────────

interface GeneratePatchInput {
  affectedFiles: string[];
  intent: string;
  summary: string;
  prompt: string;
  mode: AiEditorMode;
}

export function generatePatch(input: GeneratePatchInput): DiffHunk[] {
  if (input.mode === 'safe') {
    return buildAnalysisDiff(input);
  }

  return buildProposalDiff(input);
}

// ── Safe mode: analysis-only diff (no real changes) ───────────────────────

function buildAnalysisDiff(input: GeneratePatchInput): DiffHunk[] {
  return input.affectedFiles.map((file) => ({
    file,
    oldStart: 1,
    newStart: 1,
    lines: [
      { type: 'context' as const, content: `// Archivo: ${file}` },
      {
        type: 'context' as const,
        content: `// Intención detectada: ${input.intent}`,
      },
      {
        type: 'context' as const,
        content: `// Modo: seguro (solo análisis). No se aplicarán cambios.`,
      },
      {
        type: 'add' as const,
        content: `// + Cambio propuesto: ${input.summary}`,
      },
    ],
  }));
}

// ── Assisted/Direct mode: structured diff proposal ────────────────────────

function buildProposalDiff(input: GeneratePatchInput): DiffHunk[] {
  const hunks: DiffHunk[] = [];

  for (const file of input.affectedFiles) {
    const hunk = buildHunkForIntent(file, input.intent, input.prompt);
    if (hunk) {
      hunks.push(hunk);
    }
  }

  return hunks;
}

function buildHunkForIntent(file: string, intent: string, prompt: string): DiffHunk | null {
  const lowerPrompt = prompt.toLowerCase();

  if (intent === 'update_config' && file.includes('configuracion')) {
    return {
      file,
      oldStart: 1,
      newStart: 1,
      lines: [
        { type: 'context', content: '// src/app/configuracion/page.tsx' },
        { type: 'remove', content: "-  timeZone: 'America/Mexico_City'," },
        { type: 'add', content: "+  timeZone: 'America/Cancun'," },
      ],
    };
  }

  if (intent === 'compact_layout') {
    return {
      file,
      oldStart: 1,
      newStart: 1,
      lines: [
        { type: 'context', content: `// ${file}` },
        { type: 'remove', content: '-  <div className="space-y-5">' },
        { type: 'add', content: '+  <div className="space-y-3">' },
        { type: 'remove', content: '-  className="p-5"' },
        { type: 'add', content: '+  className="p-3"' },
      ],
    };
  }

  if (intent === 'update_styles' && (file.includes('globals') || file.includes('tailwind'))) {
    return {
      file,
      oldStart: 1,
      newStart: 1,
      lines: [
        { type: 'context', content: `// ${file}` },
        {
          type: 'add',
          content: `+ /* Modificación de estilo basada en: "${lowerPrompt.slice(0, 60)}" */`,
        },
      ],
    };
  }

  if (intent === 'update_copy') {
    return {
      file,
      oldStart: 1,
      newStart: 1,
      lines: [
        { type: 'context', content: `// ${file}` },
        {
          type: 'add',
          content: `+ {/* Actualización de copy: "${lowerPrompt.slice(0, 60)}" */}`,
        },
      ],
    };
  }

  return {
    file,
    oldStart: 1,
    newStart: 1,
    lines: [
      { type: 'context', content: `// ${file}` },
      {
        type: 'add',
        content: `+ // TODO: Aplicar cambio — ${intent}: ${lowerPrompt.slice(0, 80)}`,
      },
    ],
  };
}
