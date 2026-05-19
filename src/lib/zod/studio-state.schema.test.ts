import { describe, it, expect } from 'vitest';
import {
  StudioStateRowSchema,
  StudioStateInsertSchema,
  StudioStateUpdateSchema,
  StudioStatePayloadSchema,
  type StudioStateRow,
  type StudioStateInsert,
  type StudioStateUpdate,
} from './studio-state.schema';

describe('Studio State Schemas', () => {
  const validUUID = '550e8400-e29b-41d4-a716-446655440000';
  const validDateTime = '2026-05-18T12:00:00Z';

  describe('StudioStatePayloadSchema', () => {
    it('accepts empty object', () => {
      expect(StudioStatePayloadSchema.safeParse({})).toHaveProperty('success', true);
    });

    it('accepts any key-value pairs', () => {
      const payload = {
        foo: 'bar',
        nested: { key: 'value' },
        array: [1, 2, 3],
      };
      expect(StudioStatePayloadSchema.safeParse(payload)).toHaveProperty('success', true);
    });

    it('accepts null values', () => {
      expect(StudioStatePayloadSchema.safeParse({ key: null })).toHaveProperty('success', true);
    });
  });

  describe('StudioStateRowSchema', () => {
    const validRow = {
      created_at: validDateTime,
      key: 'my-key',
      owner_id: validUUID,
      payload: { foo: 'bar' },
      schema_version: 1,
      updated_at: validDateTime,
    };

    it('accepts valid row', () => {
      expect(StudioStateRowSchema.safeParse(validRow)).toHaveProperty('success', true);
    });

    it('rejects row with invalid UUID', () => {
      const invalid = { ...validRow, owner_id: 'not-a-uuid' };
      const result = StudioStateRowSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('rejects row with invalid datetime', () => {
      const invalid = { ...validRow, created_at: 'not-a-datetime' };
      const result = StudioStateRowSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('rejects row with empty key', () => {
      const invalid = { ...validRow, key: '' };
      const result = StudioStateRowSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('rejects row with non-positive schema_version', () => {
      const invalid = { ...validRow, schema_version: 0 };
      const result = StudioStateRowSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('rejects row with float schema_version', () => {
      const invalid = { ...validRow, schema_version: 1.5 };
      const result = StudioStateRowSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('rejects row with missing fields', () => {
      const invalid = { key: 'my-key' };
      const result = StudioStateRowSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('infers correct type', () => {
      const row: StudioStateRow = {
        created_at: validDateTime,
        key: 'my-key',
        owner_id: validUUID,
        payload: { foo: 'bar' },
        schema_version: 1,
        updated_at: validDateTime,
      };
      expect(row).toBeDefined();
    });
  });

  describe('StudioStateInsertSchema', () => {
    const validInsert = {
      key: 'my-key',
      payload: { foo: 'bar' },
    };

    it('accepts minimal insert with required fields', () => {
      expect(StudioStateInsertSchema.safeParse(validInsert)).toHaveProperty('success', true);
    });

    it('accepts insert with optional owner_id', () => {
      const insert = { ...validInsert, owner_id: validUUID };
      expect(StudioStateInsertSchema.safeParse(insert)).toHaveProperty('success', true);
    });

    it('accepts insert with optional created_at', () => {
      const insert = { ...validInsert, created_at: validDateTime };
      expect(StudioStateInsertSchema.safeParse(insert)).toHaveProperty('success', true);
    });

    it('accepts insert with optional updated_at', () => {
      const insert = { ...validInsert, updated_at: validDateTime };
      expect(StudioStateInsertSchema.safeParse(insert)).toHaveProperty('success', true);
    });

    it('accepts insert with optional schema_version', () => {
      const insert = { ...validInsert, schema_version: 1 };
      expect(StudioStateInsertSchema.safeParse(insert)).toHaveProperty('success', true);
    });

    it('accepts insert with all optional fields', () => {
      const insert = {
        ...validInsert,
        owner_id: validUUID,
        created_at: validDateTime,
        updated_at: validDateTime,
        schema_version: 1,
      };
      expect(StudioStateInsertSchema.safeParse(insert)).toHaveProperty('success', true);
    });

    it('rejects insert without key', () => {
      const invalid = { payload: { foo: 'bar' } };
      const result = StudioStateInsertSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('rejects insert with empty key', () => {
      const invalid = { key: '', payload: { foo: 'bar' } };
      const result = StudioStateInsertSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('rejects insert without payload', () => {
      const invalid = { key: 'my-key' };
      const result = StudioStateInsertSchema.safeParse(invalid);
      expect(result).toHaveProperty('success', false);
    });

    it('infers correct type', () => {
      const insert: StudioStateInsert = {
        key: 'my-key',
        payload: { foo: 'bar' },
      };
      expect(insert).toBeDefined();
    });
  });

  describe('StudioStateUpdateSchema', () => {
    it('accepts empty update', () => {
      expect(StudioStateUpdateSchema.safeParse({})).toHaveProperty('success', true);
    });

    it('accepts update with key', () => {
      expect(StudioStateUpdateSchema.safeParse({ key: 'new-key' })).toHaveProperty('success', true);
    });

    it('accepts update with payload', () => {
      expect(StudioStateUpdateSchema.safeParse({ payload: { foo: 'bar' } })).toHaveProperty(
        'success',
        true
      );
    });

    it('accepts update with owner_id', () => {
      expect(StudioStateUpdateSchema.safeParse({ owner_id: validUUID })).toHaveProperty(
        'success',
        true
      );
    });

    it('accepts update with created_at', () => {
      expect(StudioStateUpdateSchema.safeParse({ created_at: validDateTime })).toHaveProperty(
        'success',
        true
      );
    });

    it('accepts update with updated_at', () => {
      expect(StudioStateUpdateSchema.safeParse({ updated_at: validDateTime })).toHaveProperty(
        'success',
        true
      );
    });

    it('accepts update with schema_version', () => {
      expect(StudioStateUpdateSchema.safeParse({ schema_version: 2 })).toHaveProperty(
        'success',
        true
      );
    });

    it('accepts update with all fields', () => {
      const update = {
        key: 'new-key',
        payload: { foo: 'bar' },
        owner_id: validUUID,
        created_at: validDateTime,
        updated_at: validDateTime,
        schema_version: 2,
      };
      expect(StudioStateUpdateSchema.safeParse(update)).toHaveProperty('success', true);
    });

    it('rejects update with empty key', () => {
      const result = StudioStateUpdateSchema.safeParse({ key: '' });
      expect(result).toHaveProperty('success', false);
    });

    it('rejects update with invalid owner_id', () => {
      const result = StudioStateUpdateSchema.safeParse({
        owner_id: 'not-a-uuid',
      });
      expect(result).toHaveProperty('success', false);
    });

    it('rejects update with non-positive schema_version', () => {
      const result = StudioStateUpdateSchema.safeParse({
        schema_version: 0,
      });
      expect(result).toHaveProperty('success', false);
    });

    it('infers correct type', () => {
      const update: StudioStateUpdate = {
        key: 'new-key',
      };
      expect(update).toBeDefined();
    });
  });
});
