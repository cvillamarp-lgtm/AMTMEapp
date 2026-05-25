import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../logging/logger';

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  headers?: ZodSchema;
}

export interface ValidatedRequest {
  body?: unknown;
  query?: unknown;
  params?: unknown;
  headers?: unknown;
}

export class ValidationService {
  static validate<T>(schema: ZodSchema, data: unknown, context: string = 'validation'): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(`Validation failed in ${context}`, error, {
          metadata: {
            errors: error.errors,
            data: typeof data === 'object' ? Object.keys(data as object) : typeof data,
          },
        });
        throw AppError.fromZodError(error, { endpoint: context });
      }
      throw error;
    }
  }

  static async validateAsync<T>(
    schema: ZodSchema,
    data: unknown,
    context: string = 'validation'
  ): Promise<T> {
    try {
      return await schema.parseAsync(data);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(`Async validation failed in ${context}`, error, {
          metadata: { errors: error.errors },
        });
        throw AppError.fromZodError(error, { endpoint: context });
      }
      throw error;
    }
  }

  static isSafe<T>(schema: ZodSchema, data: unknown): boolean {
    const result = schema.safeParse(data);
    return result.success;
  }

  static sanitize<T>(schema: ZodSchema, data: unknown): T | null {
    const result = schema.safeParse(data);
    return result.success ? result.data : null;
  }
}

// API Route Validation Middleware
export async function validateRequest(
  body: unknown,
  schemas: ValidationSchemas,
  requestId?: string
) {
  const validated: ValidatedRequest = {};

  if (schemas.body) {
    validated.body = await ValidationService.validateAsync(schemas.body, body, 'request-body');
  }

  if (schemas.query) {
    validated.query = await ValidationService.validateAsync(schemas.query, {}, 'request-query');
  }

  if (schemas.params) {
    validated.params = await ValidationService.validateAsync(schemas.params, {}, 'request-params');
  }

  logger.info('Request validation successful', {
    requestId,
    endpoint: 'validation-middleware',
  });

  return validated;
}
