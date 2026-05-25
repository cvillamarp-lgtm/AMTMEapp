import { describe, expect, it } from 'vitest';
import { detectBlockedAction } from '@/lib/ai-editor/types';
import { parseInstruction } from '@/lib/ai-editor/parseInstruction';
import { resolveAffectedFiles, assessRisk } from '@/lib/ai-editor/fileResolver';
import { generatePatch } from '@/lib/ai-editor/generatePatch';
import { validatePatch } from '@/lib/ai-editor/validatePatch';
import { applyPatch } from '@/lib/ai-editor/applyPatch';
import { createRollback } from '@/lib/ai-editor/createRollback';
import { buildHistoryEntry, addChangeLogEntry, getChangeLog } from '@/lib/ai-editor/changeLog';

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

// ── validatePatch ─────────────────────────────────────────────────────────

describe('validatePatch', () => {
  it('pasa validación con riesgo low', () => {
    const diff = generatePatch({
      affectedFiles: ['src/app/ia/editor/page.tsx'],
      intent: 'update_copy',
      summary: 'texto',
      prompt: 'actualiza el texto',
      mode: 'assisted',
    });
    const result = validatePatch(diff, 'low');
    expect(result.passed).toBe(true);
    expect(result.status).toBe('passed');
  });

  it('falla validación con riesgo blocked', () => {
    const result = validatePatch([], 'blocked');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('failed');
  });

  it('detecta patrones destructivos en diff', () => {
    const diff = [
      {
        file: 'danger.ts',
        oldStart: 1,
        newStart: 1,
        lines: [{ type: 'add' as const, content: '+ rm -rf /' }],
      },
    ];
    const result = validatePatch(diff, 'low');
    expect(result.passed).toBe(false);
  });
});

// ── applyPatch ────────────────────────────────────────────────────────────

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

  it('aplica en modo direct cuando validaciones pasan', () => {
    const result = applyPatch(basePlan, 'direct', 'test-id-123');
    expect(result.success).toBe(true);
    expect(result.branchName).toContain('ai-editor/');
  });

  it('no aplica en modo safe', () => {
    const result = applyPatch(basePlan, 'safe', 'test-safe');
    expect(result.success).toBe(false);
  });

  it('no aplica si validación no pasó', () => {
    const plan = { ...basePlan, validationStatus: 'failed' as const };
    const result = applyPatch(plan, 'direct', 'test-fail');
    expect(result.success).toBe(false);
  });

  it('no aplica si riesgo bloqueado', () => {
    const plan = { ...basePlan, riskLevel: 'blocked' as const };
    const result = applyPatch(plan, 'direct', 'test-blocked');
    expect(result.success).toBe(false);
  });
});

// ── createRollback ────────────────────────────────────────────────────────

describe('createRollback', () => {
  it('revierte cuando rollback disponible', () => {
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
    const result = createRollback(plan, 'req-abc');
    expect(result.success).toBe(true);
    expect(result.restoredFiles).toContain('src/app/configuracion/page.tsx');
  });

  it('falla si rollback no disponible', () => {
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
    const result = createRollback(plan, 'req-no');
    expect(result.success).toBe(false);
  });
});

// ── changeLog ─────────────────────────────────────────────────────────────

describe('changeLog', () => {
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
});
