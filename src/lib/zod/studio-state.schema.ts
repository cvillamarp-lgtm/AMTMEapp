import { z } from 'zod';

export const StudioStatePayloadSchema = z.record(z.unknown());

export const StudioStateRowSchema = z.object({
  created_at: z.string().datetime(),
  key: z.string().min(1),
  owner_id: z.string().uuid(),
  payload: StudioStatePayloadSchema,
  schema_version: z.number().int().positive(),
  updated_at: z.string().datetime(),
});

export const StudioStateInsertSchema = z.object({
  key: z.string().min(1),
  payload: StudioStatePayloadSchema,
  owner_id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  schema_version: z.number().int().positive().optional(),
});

export const StudioStateUpdateSchema = z.object({
  key: z.string().min(1).optional(),
  payload: StudioStatePayloadSchema.optional(),
  owner_id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  schema_version: z.number().int().positive().optional(),
});

export type StudioStateRow = z.infer<typeof StudioStateRowSchema>;
export type StudioStateInsert = z.infer<typeof StudioStateInsertSchema>;
export type StudioStateUpdate = z.infer<typeof StudioStateUpdateSchema>;
