import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';

const originalFetch = globalThis.fetch?.bind(globalThis);

beforeEach(() => {
  // Provide a safe, non-blocking default fetch mock for ai-editor endpoints.
  // Individual tests can still override with vi.spyOn(global, 'fetch') or vi.fn().
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();

    if (url.includes('/api/ai-editor/history')) {
      return new Response(JSON.stringify({ entries: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.includes('/api/ai-editor/')) {
      // Safe default for analyze / apply / validate / rollback / generate-patch during tests
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Mocked response for test stability',
          entries: [],
          plan: null,
          branchName: 'mock/branch',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // For everything else, fall back to original fetch if available (e.g. for MSW or real calls in some tests)
    if (originalFetch) {
      return originalFetch(input, init);
    }

    return new Response('{}', { status: 200 });
  }) as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
});
