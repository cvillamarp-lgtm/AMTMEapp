'use client';

import { useState } from 'react';

interface ReasoningDisclosureProps {
  reasoning: string;
  model?: string;
  confidence?: number;
  compact?: boolean;
}

export function ReasoningDisclosure({ reasoning, model, confidence, compact = false }: ReasoningDisclosureProps) {
  const [open, setOpen] = useState(!compact);

  return (
    <div className="rounded-2xl border border-black/8 bg-[#F5F1E8] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#0C1F36] hover:bg-black/5"
      >
        <span className="flex items-center gap-2">
          Razonamiento del modelo
          {model && <span className="text-xs text-black/40">({model})</span>}
          {confidence !== undefined && (
            <span className="text-xs text-black/40">· {Math.round(confidence * 100)}% confianza</span>
          )}
        </span>
        <span className="text-black/40">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm leading-relaxed text-[#0C1F36]/90 border-t border-black/8 pt-3">
          {reasoning}
        </div>
      )}
    </div>
  );
}
