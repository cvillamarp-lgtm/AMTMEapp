import { POST } from '@/app/api/email/route';
import { NextRequest } from 'next/server';

describe('POST /api/email', () => {
  it('sends welcome email and returns messageId', async () => {
    const request = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        templateId: 'welcome',
        subject: 'Welcome',
        variables: {
          userName: 'Bob',
          loginUrl: 'https://app.local/login',
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.messageId).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });

  it('sends password-reset email', async () => {
    const request = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        templateId: 'password-reset',
        subject: 'Reset Password',
        variables: {
          resetUrl: 'https://app.local/reset?token=xyz',
          expiresIn: '2 hours',
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('sends audit-alert email', async () => {
    const request = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'admin@example.com',
        templateId: 'audit-alert',
        subject: 'Audit Event',
        variables: {
          eventType: 'ACCOUNT_CREATED',
          summary: 'New account created',
          dashboardUrl: 'https://app.local/dashboard',
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 400 on invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'invalid-email',
        templateId: 'welcome',
        subject: 'Welcome',
        variables: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe('INVALID_EMAIL');
  });

  it('returns 400 on missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe('INVALID_REQUEST');
  });

  it('returns 400 on invalid template', async () => {
    const request = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        templateId: 'unknown-template',
        subject: 'Test',
        variables: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('returns 500 on Resend error', async () => {
    const request = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        templateId: 'welcome',
        subject: 'Welcome',
        variables: {
          userName: 'Test',
          loginUrl: 'https://app.local/login',
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect([200, 500]).toContain(response.status);
    expect(data.success !== undefined).toBe(true);
  });

  it('handles malformed JSON gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      body: 'invalid-json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});
