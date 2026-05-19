# AMTME Automation Policy

## Estado
Fase 6 — Automatización controlada.

## Principio rector
Toda automatización es simulationOnly y requiere aprobación humana explícita.

## Qué permite Fase 6
- Preparar content packs.
- Preparar checklist de episodio.
- Preparar visual briefs.
- Preparar distribution plans.
- Preparar revisión de métricas.

## Qué prohíbe Fase 6
- Auto-publicación.
- DMs automáticos.
- Acciones destructivas.
- APIs externas.
- Scraping.
- Email campaigns reales.
- Cron real de producción.
- Edge Functions.
- Ejecución automática.

## Human Approval Workflow
- Pending approval.
- Approved.
- Rejected.
- No auto-approval.

## Audit Logs
- Retención indefinida.
- No deletion permitted.
- Registro de actor, timestamp, taskId, status y reason cuando aplique.

## Rate Limiting
- 10 tareas por hora.
- 50 tareas por día.
- Rechazo automático si se excede límite.

## Task Status Lifecycle
enqueued
→ simulated
→ pending_approval
→ approved o rejected

En Fase 6, approved no ejecuta acciones reales. Solo queda listo para revisión futura.

## Phase 6 Guarantees
- No real automation execution occurs.
- All tasks are simulation-only.
- All tasks require human approval.
- All decisions are audited.
- Forbidden tasks are rejected at validation.
- Rate limits prevent abuse.
- No auto-publishing.
- No auto-DMs.
- No destructive actions.

## Next Phase
Fase 7 solo puede iniciar después de que Fase 6 esté mergeada y main esté estable.
