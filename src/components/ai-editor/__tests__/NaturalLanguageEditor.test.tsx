import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { NaturalLanguageEditor } from '@/components/ai-editor/NaturalLanguageEditor';

const historyOk = () =>
  Promise.resolve(
    new Response(
      JSON.stringify({ entries: [], persistenceType: 'session', persistenceSource: 'memory' }),
      { status: 200 }
    )
  );

const analyzeOk = () =>
  Promise.resolve(
    new Response(
      JSON.stringify({
        requestId: 'req-test-123',
        plan: {
          intent: 'improve_ui',
          summary: 'Mejora el dashboard priorizando episodios y métricas.',
          affectedFiles: ['src/app/dashboard/page.tsx'],
          affectedRoutes: ['/dashboard'],
          riskLevel: 'low',
          requiresApproval: false,
          diff: [],
          validationStatus: 'deferred',
          validationChecks: [],
          rollbackAvailable: false,
        },
        persistenceType: 'session',
        persistenceSource: 'memory',
      }),
      { status: 200 }
    )
  );

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockImplementation(historyOk);
});

afterEach(() => {
  vi.clearAllMocks();
});

async function renderEditor() {
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<NaturalLanguageEditor />);
  });
  return result!;
}

describe('NaturalLanguageEditor — render inicial', () => {
  it('muestra textarea con placeholder correcto', async () => {
    await renderEditor();
    expect(screen.getByPlaceholderText(/dashboard sea más claro/i)).toBeInTheDocument();
  });

  it('muestra badge de modo seguro', async () => {
    await renderEditor();
    expect(screen.getByText(/modo seguro/i)).toBeInTheDocument();
  });

  it('muestra empty state cuando no hay instrucción activa', async () => {
    await renderEditor();
    expect(screen.getByText(/todavía no hay una instrucción activa/i)).toBeInTheDocument();
  });

  it('botón analizar está deshabilitado con textarea vacío', async () => {
    await renderEditor();
    const btn = screen.getByRole('button', { name: /analizar instrucción/i });
    expect(btn).toBeDisabled();
  });

  it('botón analizar se habilita al escribir texto', async () => {
    await renderEditor();
    const textarea = screen.getByPlaceholderText(/dashboard sea más claro/i);
    await userEvent.type(textarea, 'mejora la pantalla de métricas');
    expect(screen.getByRole('button', { name: /analizar instrucción/i })).not.toBeDisabled();
  });
});

describe('NaturalLanguageEditor — flujo de análisis', () => {
  it('llama al endpoint correcto al analizar', async () => {
    mockFetch.mockImplementationOnce(historyOk).mockImplementationOnce(analyzeOk);
    await renderEditor();
    await userEvent.type(
      screen.getByPlaceholderText(/dashboard sea más claro/i),
      'mejora el dashboard'
    );
    fireEvent.click(screen.getByRole('button', { name: /analizar instrucción/i }));
    await waitFor(() => {
      const calls = mockFetch.mock.calls as [string, ...unknown[]][];
      expect(calls.some((c) => c[0] === '/api/ai-editor/analyze')).toBe(true);
    });
  });

  it('muestra estado analyzing mientras espera respuesta', async () => {
    mockFetch.mockImplementationOnce(historyOk).mockImplementationOnce(() => new Promise(() => {}));
    await renderEditor();
    await userEvent.type(
      screen.getByPlaceholderText(/dashboard sea más claro/i),
      'mejora el dashboard'
    );
    fireEvent.click(screen.getByRole('button', { name: /analizar instrucción/i }));
    await waitFor(() => expect(screen.getByText(/analizando/i)).toBeInTheDocument());
  });

  it('muestra plan cuando hay respuesta exitosa', async () => {
    mockFetch.mockImplementationOnce(historyOk).mockImplementationOnce(analyzeOk);
    await renderEditor();
    await userEvent.type(
      screen.getByPlaceholderText(/dashboard sea más claro/i),
      'mejora el dashboard'
    );
    fireEvent.click(screen.getByRole('button', { name: /analizar instrucción/i }));

    // After plan loads, "Limpiar" button appears and "Analizar instrucción" disappears
    await waitFor(
      () => expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument(),
      { timeout: 4000 }
    );
    expect(screen.queryByRole('button', { name: /analizar instrucción/i })).not.toBeInTheDocument();
  });

  it('muestra error si el endpoint falla', async () => {
    mockFetch
      .mockImplementationOnce(historyOk)
      .mockImplementationOnce(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: 'Servicio no disponible.' }), { status: 500 })
        )
      );
    await renderEditor();
    await userEvent.type(
      screen.getByPlaceholderText(/dashboard sea más claro/i),
      'mejora el dashboard'
    );
    fireEvent.click(screen.getByRole('button', { name: /analizar instrucción/i }));
    await waitFor(() => expect(screen.getByText(/servicio no disponible/i)).toBeInTheDocument());
  });

  it('muestra acción bloqueada si endpoint devuelve blocked', async () => {
    mockFetch
      .mockImplementationOnce(historyOk)
      .mockImplementationOnce(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({ blocked: true, reason: 'Eliminar archivos está bloqueado.' }),
            { status: 422 }
          )
        )
      );
    await renderEditor();
    await userEvent.type(
      screen.getByPlaceholderText(/dashboard sea más claro/i),
      'eliminar el archivo de rutas'
    );
    fireEvent.click(screen.getByRole('button', { name: /analizar instrucción/i }));
    await waitFor(() => expect(screen.getByText(/acción bloqueada/i)).toBeInTheDocument());
  });
});

describe('NaturalLanguageEditor — guardrails', () => {
  it('botón aplicar no aparece antes de tener plan válido', async () => {
    await renderEditor();
    expect(screen.queryByText(/preparar rama/i)).not.toBeInTheDocument();
  });

  it('timeline aparece después de iniciar análisis', async () => {
    mockFetch.mockImplementationOnce(historyOk).mockImplementationOnce(() => new Promise(() => {}));
    await renderEditor();
    await userEvent.type(
      screen.getByPlaceholderText(/dashboard sea más claro/i),
      'mejora el dashboard'
    );
    fireEvent.click(screen.getByRole('button', { name: /analizar instrucción/i }));
    await waitFor(() => expect(screen.getByText('Análisis')).toBeInTheDocument());
  });

  it('empty state desaparece cuando hay instrucción activa', async () => {
    mockFetch.mockImplementationOnce(historyOk).mockImplementationOnce(() => new Promise(() => {}));
    await renderEditor();
    expect(screen.getByText(/todavía no hay una instrucción activa/i)).toBeInTheDocument();
    await userEvent.type(
      screen.getByPlaceholderText(/dashboard sea más claro/i),
      'mejora el dashboard'
    );
    fireEvent.click(screen.getByRole('button', { name: /analizar instrucción/i }));
    await waitFor(() =>
      expect(screen.queryByText(/todavía no hay una instrucción activa/i)).not.toBeInTheDocument()
    );
  });
});
