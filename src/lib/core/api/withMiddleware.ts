import { NextRequest, NextResponse } from 'next/server';
import { AppError, isAppError } from '../errors/AppError';
import { logger } from '../logging/logger';
import { createRequestContext, clearRequestContext } from '../telemetry/RequestContext';
import { applySecurity, defaultSecurityConfig, SecurityService } from '../security/SecurityService';
import { ApiResponseService } from '../api/ApiResponseService';

export type ApiHandler = (request: NextRequest) => Promise<Response>;

export function withMiddleware(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest): Promise<Response> => {
    const context = createRequestContext(request);

    try {
      // Log incoming request
      logger.request(context.method, context.endpoint, {
        requestId: context.requestId,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
      });

      // Apply security middleware
      const securityError = await applySecurity(request, defaultSecurityConfig);
      if (securityError) {
        logger.warn('Security check failed', {
          requestId: context.requestId,
          endpoint: context.endpoint,
        });
        return securityError;
      }

      // Execute handler
      const response = await handler(request);

      // Add headers if not already set
      if (response instanceof NextResponse) {
        if (!response.headers.has('x-request-id')) {
          response.headers.set('x-request-id', context.requestId);
        }
        // Post-merge polish: activate SecurityService headers (CSP, HSTS, X-Frame-Options, etc.)
        // These were implemented in foundations but never wired to responses.
        SecurityService.applySecurityHeaders(response, defaultSecurityConfig);
      }

      // Log response
      const statusCode = response instanceof NextResponse ? response.status : 200;
      logger.response(context.method, context.endpoint, statusCode, context.getDuration(), {
        requestId: context.requestId,
      });

      return response;
    } catch (error) {
      const actualError = error instanceof Error ? error : new Error(String(error));

      if (isAppError(error)) {
        logger.error(`Request failed: ${error.code}`, error, {
          requestId: context.requestId,
          endpoint: context.endpoint,
          severity: error.severity,
        });
        const errorResponse = ApiResponseService.error(error);
        SecurityService.applySecurityHeaders(errorResponse, defaultSecurityConfig);
        return errorResponse;
      }

      // Log unexpected error
      logger.error('Unhandled error in API handler', actualError, {
        requestId: context.requestId,
        endpoint: context.endpoint,
      });

      // Return generic error to client
      const internalError = AppError.internal('An unexpected error occurred', {
        requestId: context.requestId,
        endpoint: context.endpoint,
      });

      const internalErrorResponse = ApiResponseService.error(internalError);
      SecurityService.applySecurityHeaders(internalErrorResponse, defaultSecurityConfig);
      return internalErrorResponse;
    } finally {
      clearRequestContext();
    }
  };
}

export function apiHandler<T>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
): (request: NextRequest) => Promise<Response> {
  return withMiddleware(handler as ApiHandler);
}
