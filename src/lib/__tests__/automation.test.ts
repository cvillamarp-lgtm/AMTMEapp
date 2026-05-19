import { describe, expect, it } from 'vitest';
import * as automation from '@/lib/automation';
import type {
  AutomationQueueItem,
  AutomationTask,
  AutomationStatus,
  AutomationTaskType,
} from '@/lib/automation';

function buildAllowedTask(overrides: Partial<AutomationTask> = {}): AutomationTask {
  return {
    id: 'task-1',
    type: 'prepare_content_pack',
    trigger: 'manual',
    payload: { episodeId: 'ep-1' },
    requestedBy: 'operator-1',
    createdAt: '2026-05-19T00:00:00.000Z',
    simulationOnly: true,
    ...overrides,
  };
}

function buildQueueItem(
  status: AutomationStatus = 'enqueued',
  type: AutomationTaskType = 'prepare_content_pack'
): AutomationQueueItem {
  return {
    id: 'queue-1',
    task: buildAllowedTask({ id: 'task-queue-1', type }),
    status,
    createdAt: '2026-05-19T10:00:00.000Z',
    updatedAt: '2026-05-19T10:00:00.000Z',
    approvalStatus: 'pending_approval',
  };
}

describe('automation phase 6', () => {
  it('valida tarea permitida', () => {
    const parsed = automation.validateAutomationTask(buildAllowedTask());
    expect(parsed.type).toBe('prepare_content_pack');
  });

  it('rechaza auto_publish', () => {
    expect(() =>
      automation.rejectForbiddenAutomationTask(buildAllowedTask({ type: 'auto_publish' }))
    ).toThrow('Forbidden automation task type: auto_publish');
  });

  it('rechaza auto_dm', () => {
    expect(() =>
      automation.rejectForbiddenAutomationTask(buildAllowedTask({ type: 'auto_dm' }))
    ).toThrow('Forbidden automation task type: auto_dm');
  });

  it('rechaza destructive_delete', () => {
    expect(() =>
      automation.rejectForbiddenAutomationTask(buildAllowedTask({ type: 'destructive_delete' }))
    ).toThrow('Forbidden automation task type: destructive_delete');
  });

  it('rechaza external_post', () => {
    expect(() =>
      automation.rejectForbiddenAutomationTask(buildAllowedTask({ type: 'external_post' }))
    ).toThrow('Forbidden automation task type: external_post');
  });

  it('rechaza scrape_external_data', () => {
    expect(() =>
      automation.rejectForbiddenAutomationTask(buildAllowedTask({ type: 'scrape_external_data' }))
    ).toThrow('Forbidden automation task type: scrape_external_data');
  });

  it('rechaza send_email_campaign', () => {
    expect(() =>
      automation.rejectForbiddenAutomationTask(buildAllowedTask({ type: 'send_email_campaign' }))
    ).toThrow('Forbidden automation task type: send_email_campaign');
  });

  it('valida humanApprovalRequired', () => {
    const policy = automation.getDefaultAutomationSafetyPolicy();
    expect(policy.humanApprovalRequired).toBe(true);
    expect(automation.assertHumanApprovalRequired(policy)).toBe(true);
  });

  it('valida noAutoPublish', () => {
    expect(automation.getDefaultAutomationSafetyPolicy().noAutoPublish).toBe(true);
  });

  it('valida noAutoDM', () => {
    expect(automation.getDefaultAutomationSafetyPolicy().noAutoDM).toBe(true);
  });

  it('valida noDestructiveAction', () => {
    expect(automation.getDefaultAutomationSafetyPolicy().noDestructiveAction).toBe(true);
  });

  it('valida simulationOnly', () => {
    expect(automation.getDefaultAutomationSafetyPolicy().simulationOnly).toBe(true);
  });

  it('valida enqueueAutomationTask', () => {
    const now = new Date('2026-05-19T10:20:00.000Z');
    const item = automation.enqueueAutomationTask(
      buildAllowedTask(),
      [],
      undefined,
      undefined,
      now
    );

    expect(item.status).toBe('enqueued');
    expect(item.approvalStatus).toBe('pending_approval');
    expect(item.task.simulationOnly).toBe(true);
  });

  it('valida markTaskAsPendingApproval', () => {
    const queueItem = buildQueueItem('enqueued');
    const updated = automation.markTaskAsPendingApproval(
      queueItem,
      new Date('2026-05-19T10:25:00.000Z')
    );

    expect(updated.status).toBe('pending_approval');
    expect(updated.approvalStatus).toBe('pending_approval');
  });

  it('valida markTaskAsApproved con approvedBy', () => {
    const queueItem = automation.markTaskAsPendingApproval(buildQueueItem('enqueued'));
    const approved = automation.markTaskAsApproved(
      queueItem,
      'reviewer-1',
      undefined,
      new Date('2026-05-19T10:30:00.000Z')
    );

    expect(approved.status).toBe('approved');
    expect(approved.approvedBy).toBe('reviewer-1');
    expect(approved.approvedAt).toBe('2026-05-19T10:30:00.000Z');
  });

  it('valida markTaskAsRejected con reason obligatorio', () => {
    const queueItem = buildQueueItem('pending_approval');

    expect(() => automation.markTaskAsRejected(queueItem, 'reviewer-1', '   ')).toThrow(
      'rejection reason is required.'
    );

    const rejected = automation.markTaskAsRejected(
      queueItem,
      'reviewer-1',
      'Falta información de contexto.'
    );

    expect(rejected.status).toBe('rejected');
    expect(rejected.rejectedBy).toBe('reviewer-1');
    expect(rejected.rejectionReason).toBe('Falta información de contexto.');
  });

  it('valida buildAutomationAuditEntry', () => {
    const queueItem = buildQueueItem('simulated');
    const entry = automation.buildAutomationAuditEntry(
      queueItem,
      'auditor-1',
      'Registro de control.',
      new Date('2026-05-19T11:00:00.000Z')
    );

    expect(entry.taskId).toBe(queueItem.task.id);
    expect(entry.actor).toBe('auditor-1');
    expect(entry.status).toBe('simulated');
  });

  it('valida simulateAutomationTask sin ejecución real', () => {
    const result = automation.simulateAutomationTask(
      buildQueueItem('enqueued'),
      new Date('2026-05-19T11:05:00.000Z')
    );

    expect(result.executed).toBe(false);
    expect(result.simulationOnly).toBe(true);
    expect(result.queueItem.status).toBe('simulated');
  });

  it('valida que task approved se detiene y no ejecuta', () => {
    const approvedItem: AutomationQueueItem = {
      ...buildQueueItem('approved'),
      approvalStatus: 'approved',
      approvedBy: 'reviewer-2',
      approvedAt: '2026-05-19T11:10:00.000Z',
    };

    const result = automation.simulateAutomationTask(approvedItem);

    expect(result.executed).toBe(false);
    expect(result.queueItem.status).toBe('approved');
    expect(result.note).toContain('do not execute real actions');
  });

  it('valida rate limit por hora', () => {
    const now = new Date('2026-05-19T11:59:59.000Z');
    const queue = Array.from({ length: 10 }, (_, index) => ({
      ...buildQueueItem('enqueued'),
      id: `queue-hour-${index}`,
      createdAt: `2026-05-19T11:${String(index).padStart(2, '0')}:00.000Z`,
      updatedAt: `2026-05-19T11:${String(index).padStart(2, '0')}:00.000Z`,
      task: buildAllowedTask({
        id: `task-hour-${index}`,
        createdAt: `2026-05-19T11:${String(index).padStart(2, '0')}:00.000Z`,
      }),
    }));

    expect(() =>
      automation.enqueueAutomationTask(buildAllowedTask(), queue, undefined, undefined, now)
    ).toThrow('Rate limit exceeded: per hour limit reached.');
  });

  it('valida rate limit por día', () => {
    const now = new Date('2026-05-19T23:00:00.000Z');
    const queue = Array.from({ length: 50 }, (_, index) => ({
      ...buildQueueItem('enqueued'),
      id: `queue-day-${index}`,
      createdAt: `2026-05-19T00:${String(index).padStart(2, '0')}:00.000Z`,
      updatedAt: `2026-05-19T00:${String(index).padStart(2, '0')}:00.000Z`,
      task: buildAllowedTask({
        id: `task-day-${index}`,
        createdAt: `2026-05-19T00:${String(index).padStart(2, '0')}:00.000Z`,
      }),
    }));

    expect(() =>
      automation.enqueueAutomationTask(buildAllowedTask(), queue, undefined, undefined, now)
    ).toThrow('Rate limit exceeded: per day limit reached.');
  });

  it('valida payload inválido', () => {
    const invalidTask = {
      id: 'task-invalid',
      type: 'prepare_content_pack',
      trigger: 'manual',
      payload: 'invalid payload',
      requestedBy: 'operator-1',
      createdAt: '2026-05-19T00:00:00.000Z',
      simulationOnly: true,
    };

    expect(() => automation.validateAutomationTask(invalidTask)).toThrow();
  });

  it('valida estados permitidos', () => {
    const statuses: AutomationStatus[] = [
      'enqueued',
      'simulated',
      'pending_approval',
      'approved',
      'rejected',
      'failed',
      'cancelled',
    ];

    statuses.forEach((status) => {
      const parsed = automation.validateAutomationQueueItem({
        ...buildQueueItem(status),
        id: `queue-status-${status}`,
      });
      expect(parsed.status).toBe(status);
    });
  });

  it('valida audit log retention indefinida', () => {
    const entry = automation.buildAutomationAuditEntry(
      buildQueueItem('pending_approval'),
      'auditor-2'
    );
    expect(entry.retention).toBe('indefinite');
  });

  it('valida que no existe deleteAuditLog o función destructiva equivalente', () => {
    const exportedMembers = automation as unknown as Record<string, unknown>;
    expect(exportedMembers.deleteAuditLog).toBeUndefined();
  });
});
