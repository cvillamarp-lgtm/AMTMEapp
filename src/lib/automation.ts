import { z } from 'zod';

export const ALLOWED_AUTOMATION_TASK_TYPES = [
  'prepare_content_pack',
  'prepare_episode_checklist',
  'prepare_visual_brief',
  'prepare_distribution_plan',
  'prepare_metrics_review',
] as const;

export const FORBIDDEN_AUTOMATION_TASK_TYPES = [
  'auto_publish',
  'auto_dm',
  'destructive_delete',
  'external_post',
  'scrape_external_data',
  'send_email_campaign',
] as const;

const automationTaskTypeSchema = z.enum([
  ...ALLOWED_AUTOMATION_TASK_TYPES,
  ...FORBIDDEN_AUTOMATION_TASK_TYPES,
]);

const automationStatusSchema = z.enum([
  'enqueued',
  'simulated',
  'pending_approval',
  'approved',
  'rejected',
  'failed',
  'cancelled',
]);

const automationTriggerSchema = z.enum(['manual', 'scheduled', 'workflow']);

const automationApprovalStatusSchema = z.enum(['pending_approval', 'approved', 'rejected']);

const automationSafetyPolicySchema = z.object({
  humanApprovalRequired: z.literal(true),
  noAutoPublish: z.literal(true),
  noAutoDM: z.literal(true),
  noDestructiveAction: z.literal(true),
  rateLimitRequired: z.literal(true),
  auditLogRequired: z.literal(true),
  simulationOnly: z.literal(true),
});

const automationRateLimitConfigSchema = z.object({
  perHour: z.number().int().positive(),
  perDay: z.number().int().positive(),
});

const automationTaskSchema = z.object({
  id: z.string().min(1),
  type: automationTaskTypeSchema,
  trigger: automationTriggerSchema,
  payload: z.record(z.string(), z.unknown()),
  requestedBy: z.string().min(1),
  createdAt: z.string().datetime(),
  simulationOnly: z.literal(true),
});

const automationQueueItemSchema = z.object({
  id: z.string().min(1),
  task: automationTaskSchema,
  status: automationStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  approvalStatus: automationApprovalStatusSchema,
  approvedBy: z.string().min(1).optional(),
  approvedAt: z.string().datetime().optional(),
  rejectedBy: z.string().min(1).optional(),
  rejectedAt: z.string().datetime().optional(),
  rejectionReason: z.string().min(1).optional(),
});

const automationAuditLogSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().min(1),
  actor: z.string().min(1),
  timestamp: z.string().datetime(),
  status: automationStatusSchema,
  reason: z.string().min(1).optional(),
  retention: z.literal('indefinite'),
});

export type AutomationTaskType = z.infer<typeof automationTaskTypeSchema>;
export type AutomationStatus = z.infer<typeof automationStatusSchema>;
export type AutomationTrigger = z.infer<typeof automationTriggerSchema>;
export type AutomationApprovalStatus = z.infer<typeof automationApprovalStatusSchema>;
export type AutomationSafetyPolicy = z.infer<typeof automationSafetyPolicySchema>;
export type AutomationRateLimitConfig = z.infer<typeof automationRateLimitConfigSchema>;
export type AutomationTask = z.infer<typeof automationTaskSchema>;
export type AutomationQueueItem = z.infer<typeof automationQueueItemSchema>;
export type AutomationAuditLog = z.infer<typeof automationAuditLogSchema>;

function buildId(prefix: string, now: Date): string {
  return `${prefix}-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toIsoDate(date: Date): string {
  return date.toISOString();
}

function countTasksInWindow(queue: AutomationQueueItem[], now: Date, windowMs: number): number {
  const nowMs = now.getTime();
  return queue.filter((item) => nowMs - Date.parse(item.createdAt) < windowMs).length;
}

function countTasksInDay(queue: AutomationQueueItem[], now: Date): number {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  return queue.filter((item) => {
    const d = new Date(item.createdAt);
    return d.getUTCFullYear() === year && d.getUTCMonth() === month && d.getUTCDate() === day;
  }).length;
}

export function getDefaultAutomationSafetyPolicy(): AutomationSafetyPolicy {
  return automationSafetyPolicySchema.parse({
    humanApprovalRequired: true,
    noAutoPublish: true,
    noAutoDM: true,
    noDestructiveAction: true,
    rateLimitRequired: true,
    auditLogRequired: true,
    simulationOnly: true,
  });
}

export function getDefaultRateLimitConfig(): AutomationRateLimitConfig {
  return {
    perHour: 10,
    perDay: 50,
  };
}

export function validateAutomationTask(task: unknown): AutomationTask {
  return automationTaskSchema.parse(task);
}

export function rejectForbiddenAutomationTask(task: AutomationTask): AutomationTask {
  if ((FORBIDDEN_AUTOMATION_TASK_TYPES as readonly string[]).includes(task.type)) {
    throw new Error(`Forbidden automation task type: ${task.type}`);
  }

  return task;
}

export function validateRateLimitConfig(config: unknown): AutomationRateLimitConfig {
  return automationRateLimitConfigSchema.parse(config);
}

export function assertHumanApprovalRequired(
  policy: AutomationSafetyPolicy = getDefaultAutomationSafetyPolicy()
): true {
  if (!policy.humanApprovalRequired) {
    throw new Error('Human approval is required for all automation tasks.');
  }

  return true;
}

export function enqueueAutomationTask(
  taskInput: unknown,
  queue: AutomationQueueItem[],
  policy: AutomationSafetyPolicy = getDefaultAutomationSafetyPolicy(),
  rateLimitConfig: AutomationRateLimitConfig = getDefaultRateLimitConfig(),
  now: Date = new Date()
): AutomationQueueItem {
  const task = rejectForbiddenAutomationTask(validateAutomationTask(taskInput));
  assertHumanApprovalRequired(policy);

  if (!task.simulationOnly || !policy.simulationOnly) {
    throw new Error('Automation tasks must be simulation-only in Phase 6.');
  }

  const rateConfig = validateRateLimitConfig(rateLimitConfig);
  const inHour = countTasksInWindow(queue, now, 60 * 60 * 1000);
  const inDay = countTasksInDay(queue, now);

  if (inHour >= rateConfig.perHour) {
    throw new Error('Rate limit exceeded: per hour limit reached.');
  }

  if (inDay >= rateConfig.perDay) {
    throw new Error('Rate limit exceeded: per day limit reached.');
  }

  const timestamp = toIsoDate(now);

  return {
    id: buildId('queue', now),
    task,
    status: 'enqueued',
    createdAt: timestamp,
    updatedAt: timestamp,
    approvalStatus: 'pending_approval',
  };
}

export function markTaskAsPendingApproval(
  queueItem: AutomationQueueItem,
  now: Date = new Date()
): AutomationQueueItem {
  return {
    ...queueItem,
    status: 'pending_approval',
    approvalStatus: 'pending_approval',
    updatedAt: toIsoDate(now),
  };
}

export function markTaskAsApproved(
  queueItem: AutomationQueueItem,
  approvedBy: string,
  policy: AutomationSafetyPolicy = getDefaultAutomationSafetyPolicy(),
  now: Date = new Date()
): AutomationQueueItem {
  assertHumanApprovalRequired(policy);

  if (!approvedBy.trim()) {
    throw new Error('approvedBy is required.');
  }

  if (queueItem.approvalStatus !== 'pending_approval') {
    throw new Error('Task must be pending approval before it can be approved.');
  }

  return {
    ...queueItem,
    status: 'approved',
    approvalStatus: 'approved',
    approvedBy,
    approvedAt: toIsoDate(now),
    updatedAt: toIsoDate(now),
  };
}

export function markTaskAsRejected(
  queueItem: AutomationQueueItem,
  rejectedBy: string,
  reason: string,
  now: Date = new Date()
): AutomationQueueItem {
  if (!rejectedBy.trim()) {
    throw new Error('rejectedBy is required.');
  }

  if (!reason.trim()) {
    throw new Error('rejection reason is required.');
  }

  return {
    ...queueItem,
    status: 'rejected',
    approvalStatus: 'rejected',
    rejectedBy,
    rejectedAt: toIsoDate(now),
    rejectionReason: reason,
    updatedAt: toIsoDate(now),
  };
}

export function buildAutomationAuditEntry(
  queueItem: AutomationQueueItem,
  actor: string,
  reason?: string,
  now: Date = new Date()
): AutomationAuditLog {
  if (!actor.trim()) {
    throw new Error('actor is required.');
  }

  return automationAuditLogSchema.parse({
    id: buildId('audit', now),
    taskId: queueItem.task.id,
    actor,
    timestamp: toIsoDate(now),
    status: queueItem.status,
    reason,
    retention: 'indefinite',
  });
}

export function simulateAutomationTask(
  queueItem: AutomationQueueItem,
  now: Date = new Date()
): { queueItem: AutomationQueueItem; executed: false; simulationOnly: true; note: string } {
  if (queueItem.status === 'approved') {
    return {
      queueItem,
      executed: false,
      simulationOnly: true,
      note: 'Approved tasks do not execute real actions in Phase 6.',
    };
  }

  return {
    queueItem: {
      ...queueItem,
      status: 'simulated',
      updatedAt: toIsoDate(now),
    },
    executed: false,
    simulationOnly: true,
    note: 'Simulation completed without real execution.',
  };
}

export function validateAutomationQueueItem(queueItem: unknown): AutomationQueueItem {
  return automationQueueItemSchema.parse(queueItem);
}
