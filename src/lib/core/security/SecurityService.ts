import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../logging/logger';

export interface SecurityConfig {
  corsOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  maxRequestSize: number;
  enableCSP: boolean;
  enableHSTS: boolean;
}

export const defaultSecurityConfig: SecurityConfig = {
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-API-Key'],
  maxRequestSize: 10 * 1024 * 1024, // 10MB
  enableCSP: true,
  enableHSTS: process.env.NODE_ENV === 'production',
};

export class SecurityService {
  static validateOrigin(origin: string, config: SecurityConfig): boolean {
    const isAllowed = config.corsOrigins.some(
      (allowed) =>
        allowed === '*' ||
        allowed === origin ||
        (allowed.startsWith('*.') && origin.endsWith(allowed.slice(1)))
    );

    if (!isAllowed) {
      logger.warn('CORS origin rejected', {
        metadata: { rejectedOrigin: origin },
      });
    }

    return isAllowed;
  }

  static applyCORSHeaders(
    response: NextResponse,
    origin: string,
    config: SecurityConfig
  ): NextResponse {
    if (this.validateOrigin(origin, config)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', config.allowedMethods.join(', '));
      response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    return response;
  }

  static applySecurityHeaders(response: NextResponse, config: SecurityConfig): NextResponse {
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Prevent XSS
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy
    if (config.enableCSP) {
      response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https:; font-src 'self' https:;"
      );
    }

    // HSTS (HTTP Strict Transport Security)
    if (config.enableHSTS) {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }

    return response;
  }

  static validateRequestSize(contentLength: string | null, config: SecurityConfig): boolean {
    if (!contentLength) return true;

    const size = parseInt(contentLength, 10);
    if (isNaN(size) || size > config.maxRequestSize) {
      logger.warn('Request size exceeded', {
        metadata: { size, limit: config.maxRequestSize },
      });
      return false;
    }

    return true;
  }

  static generateCSRFToken(): string {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  static hashPassword(password: string): Promise<string> {
    // Use bcrypt in production: import bcrypt from 'bcryptjs'
    // For now, placeholder that should be replaced
    return Promise.resolve(password);
  }
}

export async function applySecurity(
  request: NextRequest,
  config: SecurityConfig = defaultSecurityConfig
): Promise<NextResponse | null> {
  const origin = request.headers.get('origin') || '';
  const method = request.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return SecurityService.applyCORSHeaders(response, origin, config);
  }

  // Validate request size
  const contentLength = request.headers.get('content-length');
  if (!SecurityService.validateRequestSize(contentLength, config)) {
    return new NextResponse('Payload too large', { status: 413 });
  }

  return null;
}
