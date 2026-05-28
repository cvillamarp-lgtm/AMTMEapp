import { NextResponse } from 'next/server';
import { AppError } from '../errors/AppError';
import { getRequestContext } from '../telemetry/RequestContext';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId?: string;
    timestamp: string;
    duration?: number;
  };
}

export class ApiResponseService {
  static success<T>(data: T, statusCode: number = 200): NextResponse<ApiResponse<T>> {
    const context = getRequestContext();
    const duration = context?.getDuration();

    return NextResponse.json(
      {
        success: true,
        data,
        meta: {
          requestId: context?.requestId,
          timestamp: new Date().toISOString(),
          duration,
        },
      } as ApiResponse<T>,
      { status: statusCode }
    );
  }

  static created<T>(data: T): NextResponse<ApiResponse<T>> {
    return this.success(data, 201);
  }

  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }

  static error(error: AppError | Error, statusCode?: number): NextResponse<ApiResponse> {
    const context = getRequestContext();

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.context.metadata,
          },
          meta: {
            requestId: context?.requestId || error.context.requestId,
            timestamp: new Date().toISOString(),
            duration: context?.getDuration(),
          },
        } as ApiResponse,
        { status: statusCode || error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'An unexpected error occurred',
        },
        meta: {
          requestId: context?.requestId,
          timestamp: new Date().toISOString(),
          duration: context?.getDuration(),
        },
      } as ApiResponse,
      { status: statusCode || 500 }
    );
  }

  static paginated<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number
  ): NextResponse<ApiResponse<{ items: T[]; pagination: object }>> {
    const context = getRequestContext();
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json(
      {
        success: true,
        data: {
          items: data,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
        meta: {
          requestId: context?.requestId,
          timestamp: new Date().toISOString(),
          duration: context?.getDuration(),
        },
      },
      { status: 200 }
    );
  }

  static redirect(url: string): NextResponse {
    return NextResponse.redirect(url, { status: 301 });
  }
}
