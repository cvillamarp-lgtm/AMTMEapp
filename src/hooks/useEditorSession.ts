/**
 * useEditorSession - Immutable conversational editor state machine for AMTME IA
 *
 * States: idle | thinking | plan-ready | confirming | applying | success | error
 * All updates return new objects. Never mutate.
 */

import { useReducer, useCallback, useEffect } from 'react';
import type { IntentAnalysis, ChangePlanItem, Proposal } from '@/lib/ia-editor/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export type EditorPhase =
  | 'idle'
  | 'thinking'
  | 'plan-ready'
  | 'confirming-high-risk'
  | 'applying-simulation'
  | 'success'
  | 'error';

export interface EditorSessionState {
  phase: EditorPhase;
  instruction: string;
  intentAnalysis: IntentAnalysis | null;
  plan: ChangePlanItem[];
  currentProposal: Proposal | null;
  simulationActive: boolean;
  error: string | null;
  history: Proposal[]; // immutable list of past proposals
}

export type EditorAction =
  | { type: 'START_THINKING'; instruction: string }
  | { type: 'RECEIVE_PLAN'; intentAnalysis: IntentAnalysis; plan: ChangePlanItem[] }
  | { type: 'REQUEST_CONFIRMATION' }
  | { type: 'APPLY_SIMULATION'; proposal: Proposal }
  | { type: 'SUCCESS'; proposal: Proposal }
  | { type: 'ERROR'; message: string }
  | { type: 'ROLLBACK'; newProposal: Proposal }
  | { type: 'LOAD_HISTORY'; history: Proposal[] }
  | { type: 'RESET' };

export const initialEditorState: EditorSessionState = {
  phase: 'idle',
  instruction: '',
  intentAnalysis: null,
  plan: [],
  currentProposal: null,
  simulationActive: false,
  error: null,
  history: [],
};

export { reducer as editorSessionReducer }; // exported pure for TDD / testing (immutable transitions)

function reducer(state: EditorSessionState, action: EditorAction): EditorSessionState {
  switch (action.type) {
    case 'START_THINKING':
      return {
        ...initialEditorState,
        phase: 'thinking',
        instruction: action.instruction,
        history: state.history, // preserve history (immutable)
      };

    case 'RECEIVE_PLAN':
      return {
        ...state,
        phase: 'plan-ready',
        intentAnalysis: action.intentAnalysis,
        plan: action.plan,
        error: null,
      };

    case 'REQUEST_CONFIRMATION':
      if (state.plan.some(p => p.risk === 'alto')) {
        return { ...state, phase: 'confirming-high-risk' };
      }
      return state;

    case 'APPLY_SIMULATION':
      return {
        ...state,
        phase: 'applying-simulation',
        currentProposal: action.proposal,
        simulationActive: true,
      };

    case 'SUCCESS':
      return {
        ...state,
        phase: 'success',
        currentProposal: action.proposal,
        history: [...state.history, action.proposal],
        simulationActive: true,
      };

    case 'ERROR':
      return {
        ...state,
        phase: 'error',
        error: action.message,
      };

    case 'ROLLBACK':
      return {
        ...state,
        phase: 'success',
        currentProposal: action.newProposal,
        history: [...state.history, action.newProposal],
      };

    case 'LOAD_HISTORY':
      return {
        ...state,
        history: action.history,
      };

    case 'RESET':
      return initialEditorState;

    default:
      return state;
  }
}

export function useEditorSession() {
  const [state, dispatch] = useReducer(reducer, initialEditorState);

  const startThinking = useCallback((instruction: string) => {
    dispatch({ type: 'START_THINKING', instruction });
  }, []);

  const receivePlan = useCallback((intentAnalysis: IntentAnalysis, plan: ChangePlanItem[]) => {
    dispatch({ type: 'RECEIVE_PLAN', intentAnalysis, plan });
  }, []);

  const requestConfirmation = useCallback(() => {
    dispatch({ type: 'REQUEST_CONFIRMATION' });
  }, []);

  const applySimulation = useCallback((proposal: Proposal) => {
    dispatch({ type: 'APPLY_SIMULATION', proposal });
  }, []);

  const completeSuccess = useCallback((proposal: Proposal) => {
    dispatch({ type: 'SUCCESS', proposal });
  }, []);

  const fail = useCallback((message: string) => {
    dispatch({ type: 'ERROR', message });
  }, []);

  const rollback = useCallback((newProposal: Proposal) => {
    dispatch({ type: 'ROLLBACK', newProposal });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const STORAGE_KEY = 'amtme-ia-editor-proposals-history';

  // Load persisted history (local first for speed, Supabase attempted in background)
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Proposal[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'LOAD_HISTORY', history: parsed });
        }
      }
    } catch {}

    // Optional Supabase load from ai_history (non-blocking, best effort)
    const client = getSupabaseBrowserClient();
    if (client) {
      client
        .from('ai_history')
        .select('payload, created_at')
        .eq('workspace_key', 'ia-editor')
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data && data.length) {
            const loaded = data
              .map((row: any) => row.payload?.proposal || row.payload)
              .filter((p: any) => p && p.id && p.simulationOnly);
            if (loaded.length) {
              // merge unique by id (immutable)
              // For simplicity in this scope we just set if richer
              dispatch({ type: 'LOAD_HISTORY', history: loaded as Proposal[] });
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Persist on history change (localStorage + Supabase insert for proposals)
  useEffect(() => {
    if (state.history.length === 0) return;
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
      }
    } catch {}

    // Supabase persistence: store each new proposal in ai_history jsonb (marker for kind)
    const client = getSupabaseBrowserClient();
    if (client && state.history.length > 0) {
      const latest = state.history[state.history.length - 1];
      // fire and forget, never block UI
      client
        .from('ai_history')
        .insert({
          owner_id: latest.userId || 'studio-anon',
          workspace_key: 'ia-editor',
          payload: { kind: 'ia-editor-proposal', proposal: latest } as any,
        })
        .then(() => {})
        .catch(() => {
          /* graceful: local is source of truth for simulation */
        });
    }
  }, [state.history]);

  return {
    state,
    actions: {
      startThinking,
      receivePlan,
      requestConfirmation,
      applySimulation,
      completeSuccess,
      fail,
      rollback,
      reset,
    },
  };
}
