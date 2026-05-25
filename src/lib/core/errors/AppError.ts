import { ZodError } from 'zod';

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_REQUEST'
  | 'RESOURCE_EXHAUSTED';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorContext {
  requestId?: string;
  userId?: string;
  endpoint?: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode = 'INTERNAL_ERROR',
    statusCode: number = 500,
    severity: ErrorSeverity = 'medium',
    context: ErrorContext = {},
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    this.code = code;
    this.statusCode = statusCode;
    this.severity = severity;
    this.context = context;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static validation(message: string, context?: ErrorContext): AppError {
    return new AppError(message, 'VALIDATION_ERROR', 400, 'low', context);
  }

  static unauthorized(message: string, context?: ErrorContext): AppError {
    return new AppError(message, 'AUTHENTICATION_ERROR', 401, 'medium', context);
  }

  static forbidden(message: string, context?: ErrorContext): AppError {
    return new AppError(message, 'AUTHORIZATION_ERROR', 403, 'medium', context);
  }

  static notFound(message: string, context?: ErrorContext): AppError {
    return new AppError(message, 'NOT_FOUND', 404, 'low', context);
  }

  static conflict(message: string, context?: ErrorContext): AppError {
    return new AppError(message, 'CONFLICT', 409, 'medium', context);
  }

  static rateLimited(message: string, context?: ErrorContext): AppError {
    return new AppError(message, 'RATE_LIMIT', 429, 'medium', context);
  }

  static internal(message: string, context?: ErrorContext, isOperational = true): AppError {
    return new AppError(message, 'INTERNAL_ERROR', 500, 'high', context, isOperational);
  }

  static fromZodError(error: ZodError, context?: ErrorContext): AppError {
    const issues = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    return new AppError('Validation failed', 'VALIDATION_ERROR', 400, 'low', {
      ...context,
      metadata: { zodErrors: issues },
    });
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      severity: this.severity,
      requestId: this.context.requestId,
      timestamp: this.context.timestamp || new Date(),
    };
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
