import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export class RequestContext {
  public requestId: string;
  public userId?: string;
  public startTime: Date;
  public endpoint: string;
  public method: string;
  public userAgent?: string;
  public ipAddress?: string;

  constructor(request: NextRequest) {
    this.requestId = request.headers.get('x-request-id') || randomUUID();
    this.userId = request.headers.get('x-user-id') || undefined;
    this.startTime = new Date();
    this.endpoint = new URL(request.url).pathname;
    this.method = request.method;
    this.userAgent = request.headers.get('user-agent') || undefined;
    this.ipAddress =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  }

  getDuration(): number {
    return Date.now() - this.startTime.getTime();
  }

  toJSON() {
    return {
      requestId: this.requestId,
      userId: this.userId,
      endpoint: this.endpoint,
      method: this.method,
      duration: this.getDuration(),
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
    };
  }
}

let currentContext: RequestContext | undefined;

export function setRequestContext(context: RequestContext): void {
  currentContext = context;
}

export function getRequestContext(): RequestContext | undefined {
  return currentContext;
}

export function clearRequestContext(): void {
  currentContext = undefined;
}

export function createRequestContext(request: NextRequest): RequestContext {
  const context = new RequestContext(request);
  setRequestContext(context);
  return context;
}
