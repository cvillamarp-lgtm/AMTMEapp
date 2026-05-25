import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectBlockedAction } from '@/lib/ai-editor/types';
import { parseInstruction } from '@/lib/ai-editor/parseInstruction';
import { resolveAffectedFiles, assessRisk } from '@/lib/ai-editor/fileResolver';
import { generatePatch } from '@/lib/ai-editor/generatePatch';
import { validatePatch } from '@/lib/ai-editor/validatePatch';
import { applyPatch } from '@/lib/ai-editor/applyPatch';
import { createRollback } from '@/lib/ai-editor/createRollback';
import {
  buildHistoryEntry,
  addChangeLogEntry,
  getChangeLog,
  CHANGE_LOG_STORAGE,
} from '@/lib/ai-editor/changeLog';

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.AI_EDITOR_GITHUB_TOKEN;
  delete process.env.AI_EDITOR_GITHUB_OWNER;
  delete process.env.AI_EDITOR_GITHUB_REPO;
  delete process.env.AI_EDITOR_GITHUB_BASE_BRANCH;
});

// ── detectBlockedAction ────────────────────────────────────────────────────

describe('detectBlockedAction', () => {
  it('permite instrucciones seguras', () => {
    expect(detectBlockedAction('mejora la pantalla de configuración').blocked).toBe(false);
  });

  it('bloquea "eliminar archivo"', () => {
    const result = detectBlockedAction('eliminar el archivo de rutas');
    expect(result.blocked).toBe(true);
    expect(result.reason).toBeTruthy();
  });

  it('bloquea exposición de claves', () => {
    const result = detectBlockedAction('pon api_key="abc123" en el env');
    expect(result.blocked).toBe(true);
  });

  it('bloquea deploy directo a producción', () => {
    const result = detectBlockedAction('deploy directo a producción ahora');
    expect(result.blocked).toBe(true);
  });

  it('bloquea rm -rf', () => {
    expect(detectBlockedAction('ejecuta rm -rf /').blocked).toBe(true);
  });
});

// ── parseInstruction ───────────────────────────────────────────────────────

describe('parseInstruction', () => {
  it('genera plan para instrucción segura', () => {
    const result = parseInstruction(
      'mejora la pantalla de configuración',
      'assisted',
      'current_page'
    );
    expect(result.blocked).toBeFalsy();
    expect(result.plan.intent).toBeTruthy();
    expect(Array.isArray(result.plan.affectedFiles)).toBe(true);
  });

  it('bloquea instrucción destructiva', () => {
    const result = parseInstruction('eliminar el archivo de rutas', 'assisted', 'current_page');
    expect(result.blocked).toBe(true);
    expect(result.plan.riskLevel).toBe('blocked');
  });

  it('modo safe siempre requiere aprobación', () => {
    const result = parseInstruction('cambia el color del botón', 'safe', 'styles_only');
    expect(result.plan.requiresApproval).toBe(true);
  });

  it('resuelve archivos para configuración', () => {
    const result = parseInstruction(
      'mejora la pantalla de configuración',
      'assisted',
      'current_page'
    );
    expect(result.plan.affectedFiles.some((f) => f.includes('configuracion'))).toBe(true);
  });
});

// ── resolveAffectedFiles ───────────────────────────────────────────────────

describe('resolveAffectedFiles', () => {
  it('detecta ruta de configuración', () => {
    const { files, routes } = resolveAffectedFiles('configuración', 'current_page');
    expect(routes).toContain('/configuracion');
    expect(files.some((f) => f.includes('configuracion'))).toBe(true);
  });

  it('alcance styles_only retorna archivos de estilo', () => {
    const { files } = resolveAffectedFiles('cambia color', 'styles_only');
    expect(files.some((f) => f.includes('globals') || f.includes('tailwind'))).toBe(true);
  });

  it('siempre retorna al menos un archivo', () => {
    const { files } = resolveAffectedFiles('algo random sin ruta', 'current_page');
    expect(files.length).toBeGreaterThanOrEqual(1);
  });
});

// ── assessRisk ────────────────────────────────────────────────────────────

describe('assessRisk', () => {
  it('asigna riesgo crítico para instrucciones destructivas', () => {
    const risk = assessRisk([], undefined, 'eliminar todo y subir a producción');
    expect(risk).toBe('critical');
  });

  it('asigna riesgo high para layout/globals', () => {
    const risk = assessRisk(['src/app/layout.tsx'], undefined, 'cambio menor');
    expect(risk).toBe('high');
  });

  it('asigna riesgo low para pocos archivos', () => {
    const risk = assessRisk(['src/app/ia/editor/page.tsx'], undefined, 'actualiza el texto');
    expect(risk).toBe('low');
  });
});

// ── generatePatch ─────────────────────────────────────────────────────────

describe('generatePatch', () => {
  it('genera diff en modo assisted', () => {
    const diff = generatePatch({
      affectedFiles: ['src/app/configuracion/page.tsx'],
      intent: 'update_config',
      summary: 'Cambia zona horaria',
      prompt: 'cambia la zona horaria a America/Cancun',
      mode: 'assisted',
    });
    expect(diff.length).toBeGreaterThanOrEqual(1);
    expect(diff[0].file).toBe('src/app/configuracion/page.tsx');
  });

  it('en modo safe genera diff de análisis', () => {
    const diff = generatePatch({
      affectedFiles: ['src/app/ia/page.tsx'],
      intent: 'improve_ui',
      summary: 'Análisis',
      prompt: 'mejora la UI',
      mode: 'safe',
    });
    expect(diff[0].lines.some((l) => l.content.includes('solo análisis'))).toBe(true);
  });
});

// ── validatePatch — Phase 2 contracts ────────────────────────────────────

describe('validatePatch', () => {
  it('riesgo low → validaciones diferidas, no passed', async () => {
    const diff = generatePatch({
      affectedFiles: ['src/app/ia/editor/page.tsx'],
      intent: 'update_copy',
      summary: 'texto',
      prompt: 'actualiza el texto',
      mode: 'assisted',
    });
    const result = await validatePatch(diff, 'low');
    // Phase 2: CI checks cannot run at request time — they are deferred
    expect(result.passed).toBe(false);
    expect(result.deferred).toBe(true);
    expect(result.status).toBe('deferred');
    expect(result.checks.every((c) => c.status === 'deferred')).toBe(true);
    expect(result.validationRun.source).toMatch(/github_actions|deferred_ci/);
  });

  it('riesgo medium → validaciones diferidas, no passed', async () => {
    const result = await validatePatch([], 'medium');
    expect(result.passed).toBe(false);
    expect(result.deferred).toBe(true);
  });

  it('riesgo high → validaciones diferidas, no passed', async () => {
    const result = await validatePatch([], 'high');
    expect(result.passed).toBe(false);
    expect(result.deferred).toBe(true);
  });

  it('falla validación con riesgo blocked', async () => {
    const result = await validatePatch([], 'blocked');
    expect(result.passed).toBe(false);
    expect(result.deferred).toBe(false);
    expect(result.status).toBe('failed');
    expect(result.checks.every((c) => c.status === 'failed')).toBe(true);
    expect(result.validationRun.source).toBe('policy_engine');
  });

  it('falla validación con riesgo critical', async () => {
    const result = await validatePatch([], 'critical');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('failed');
  });

  it('detecta patrones destructivos en diff y falla', async () => {
    const diff = [
      {
        file: 'danger.ts',
        oldStart: 1,
        newStart: 1,
        lines: [{ type: 'add' as const, content: '+ rm -rf /' }],
      },
    ];
    const result = await validatePatch(diff, 'low');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('failed');
  });

  it('checks diferidos incluyen comando CI en recommendation', async () => {
    const result = await validatePatch([], 'low');
    const typecheckCheck = result.checks.find((c) => c.name === 'typecheck');
    expect(typecheckCheck?.recommendation).toContain('npm run');
    expect(typecheckCheck?.command).toBe('npm run type-check');
  });
});

// ── applyPatch — Phase 2 contracts ───────────────────────────────────────

describe('applyPatch', () => {
  const basePlan = {
    intent: 'update_config',
    summary: 'test',
    affectedFiles: ['src/app/configuracion/page.tsx'],
    affectedRoutes: ['/configuracion'],
    riskLevel: 'low' as const,
    requiresApproval: false,
    diff: [],
    validationStatus: 'passed' as const,
    validationChecks: [],
    rollbackAvailable: false,
  };

  it('retorna ready_to_apply (no applied) con validaciones passed', async () => {
    const result = await applyPatch(basePlan, 'direct', 'test-id-123');
    expect(result.success).toBe(true);
    expect(result.status).toBe('ready_to_apply');
    expect(result.status).not.toBe('applied');
    expect(result.branchName).toContain('ai-editor/');
    expect(result.branchType).toBe('proposed');
  });

  it('permite preparar rama con validaciones diferidas', async () => {
    const plan = { ...basePlan, validationStatus: 'deferred' as const };
    const result = await applyPatch(plan, 'direct', 'test-deferred');
    expect(result.success).toBe(true);
    expect(result.status).toBe('ready_to_apply');
    expect(result.message).toContain('CI');
  });

  it('bloquea cuando validaciones fallaron explícitamente', async () => {
    const plan = { ...basePlan, validationStatus: 'failed' as const };
    const result = await applyPatch(plan, 'direct', 'test-fail');
    expect(result.success).toBe(false);
    expect(result.status).toBe('apply_blocked');
  });

  it('no aplica en modo safe', async () => {
    const result = await applyPatch(basePlan, 'safe', 'test-safe');
    expect(result.success).toBe(false);
    expect(result.status).toBe('draft');
  });

  it('no aplica si riesgo bloqueado', async () => {
    const plan = { ...basePlan, riskLevel: 'blocked' as const };
    const result = await applyPatch(plan, 'direct', 'test-blocked');
    expect(result.success).toBe(false);
    expect(result.status).toBe('apply_blocked');
  });

  it('no aplica si riesgo crítico', async () => {
    const plan = { ...basePlan, riskLevel: 'critical' as const };
    const result = await applyPatch(plan, 'direct', 'test-critical');
    expect(result.success).toBe(false);
    expect(result.status).toBe('apply_blocked');
  });

  it('mensaje deja claro que no hubo commit real', async () => {
    const result = await applyPatch(basePlan, 'direct', 'test-msg');
    expect(result.message).not.toContain('aplicado');
    expect(result.message).toContain('artefacto');
    expect(result.commitSha).toBeUndefined();
  });

  it('si hay integración GitHub configurada retorna branch real y commitSha', async () => {
    process.env.AI_EDITOR_GITHUB_TOKEN = 'x'.repeat(40);
    process.env.AI_EDITOR_GITHUB_OWNER = 'owner';
    process.env.AI_EDITOR_GITHUB_REPO = 'repo';
    process.env.AI_EDITOR_GITHUB_BASE_BRANCH = 'main';

    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ object: { sha: 'base-sha' } }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 201 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ commit: { sha: 'commit-123' } }), { status: 200 })
      );

    const result = await applyPatch(basePlan, 'direct', 'test-github', 'prompt');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.branchType).toBe('real');
    expect(result.commitSha).toBe('commit-123');
    expect(result.executionSource).toBe('github_api');
  });
});

// ── createRollback — Phase 2 contracts ───────────────────────────────────

describe('createRollback', () => {
  it('descarta plan (rollbackType: discard) cuando rollback disponible', async () => {
    const plan = {
      intent: 'update_config',
      summary: 'test',
      affectedFiles: ['src/app/configuracion/page.tsx'],
      affectedRoutes: ['/configuracion'],
      riskLevel: 'low' as const,
      requiresApproval: false,
      diff: [],
      validationStatus: 'passed' as const,
      validationChecks: [],
      rollbackAvailable: true,
    };
    const result = await createRollback(plan, 'req-abc');
    expect(result.success).toBe(true);
    // Phase 2: rollback is always a discard — no real commit was made
    expect(result.rollbackType).toBe('discard');
    // No files are "restored" since nothing was written
    expect(result.restoredFiles).toHaveLength(0);
    expect(result.message).toContain('commit');
  });

  it('falla si rollback no disponible', async () => {
    const plan = {
      intent: 'test',
      summary: 'test',
      affectedFiles: [],
      affectedRoutes: [],
      riskLevel: 'low' as const,
      requiresApproval: false,
      diff: [],
      validationStatus: 'passed' as const,
      validationChecks: [],
      rollbackAvailable: false,
    };
    const result = await createRollback(plan, 'req-no');
    expect(result.success).toBe(false);
    expect(result.rollbackType).toBe('discard');
  });

  it('usa rollback real cuando hay commitSha, branch y metadata', async () => {
    process.env.AI_EDITOR_GITHUB_TOKEN = 'x'.repeat(40);
    process.env.AI_EDITOR_GITHUB_OWNER = 'owner';
    process.env.AI_EDITOR_GITHUB_REPO = 'repo';

    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ sha: 'file-sha' }), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ commit: { sha: 'rollback-commit' } }), { status: 200 })
      );

    const plan = {
      intent: 'update_config',
      summary: 'test',
      affectedFiles: ['src/app/configuracion/page.tsx'],
      affectedRoutes: ['/configuracion'],
      riskLevel: 'low' as const,
      requiresApproval: false,
      diff: [],
      validationStatus: 'passed' as const,
      validationChecks: [],
      rollbackAvailable: true,
    };

    const result = await createRollback(plan, 'req-real', {
      branchName: 'ai-editor/req-real',
      commitSha: 'commit-123',
      rollbackMetadata: {
        strategy: 'delete_patch_artifact',
        patchFilePath: '.ai-editor/requests/req-real.json',
      },
    });
    expect(result.success).toBe(true);
    expect(result.rollbackType).toBe('revert');
    expect(result.rollbackCommitSha).toBe('rollback-commit');
  });

  it('no miente cuando existe commit pero no hay integración para rollback real', async () => {
    const plan = {
      intent: 'update_config',
      summary: 'test',
      affectedFiles: ['src/app/configuracion/page.tsx'],
      affectedRoutes: ['/configuracion'],
      riskLevel: 'low' as const,
      requiresApproval: false,
      diff: [],
      validationStatus: 'passed' as const,
      validationChecks: [],
      rollbackAvailable: true,
    };

    const result = await createRollback(plan, 'req-real-fail', {
      branchName: 'ai-editor/req-real-fail',
      commitSha: 'commit-123',
      rollbackMetadata: {
        strategy: 'delete_patch_artifact',
        patchFilePath: '.ai-editor/requests/req-real-fail.json',
      },
    });
    expect(result.success).toBe(false);
    expect(result.rollbackType).toBe('discard');
  });
});

// ── changeLog — Phase 2 contracts ─────────────────────────────────────────

describe('changeLog', () => {
  it('almacenamiento es session (in-memory)', () => {
    expect(CHANGE_LOG_STORAGE).toBe('session');
  });

  it('buildHistoryEntry incluye persistenceType: session', () => {
    const entry = buildHistoryEntry(
      `test-${Date.now()}`,
      'mejora la UI',
      'assisted',
      'current_page',
      'analyzed',
      'low',
      ['src/app/ia/editor/page.tsx']
    );
    expect(entry.persistenceType).toBe('session');
  });

  it('registra y recupera entradas', () => {
    const entry = buildHistoryEntry(
      `test-${Date.now()}`,
      'mejora la UI',
      'assisted',
      'current_page',
      'analyzed',
      'low',
      ['src/app/ia/editor/page.tsx']
    );
    addChangeLogEntry(entry);
    const log = getChangeLog();
    expect(log.some((e) => e.id === entry.id)).toBe(true);
  });

  it('retorna array vacío o con entradas', () => {
    const log = getChangeLog();
    expect(Array.isArray(log)).toBe(true);
  });

  it('rollbackAvailable es true para ready_to_apply', () => {
    const entry = buildHistoryEntry(
      `test-ra-${Date.now()}`,
      'prepara rama',
      'direct',
      'current_page',
      'ready_to_apply',
      'low',
      ['src/app/ia/editor/page.tsx']
    );
    expect(entry.rollbackAvailable).toBe(true);
  });

  it('rollbackAvailable es false para analyzed (sin commit real)', () => {
    const entry = buildHistoryEntry(
      `test-an-${Date.now()}`,
      'analiza',
      'assisted',
      'current_page',
      'analyzed',
      'low',
      []
    );
    expect(entry.rollbackAvailable).toBe(false);
  });

  it('buildHistoryEntry acepta branchName', () => {
    const entry = buildHistoryEntry(
      `test-bn-${Date.now()}`,
      'prepara rama',
      'direct',
      'current_page',
      'ready_to_apply',
      'low',
      [],
      undefined,
      'ai-editor/abc12345'
    );
    expect(entry.branchName).toBe('ai-editor/abc12345');
  });
});
