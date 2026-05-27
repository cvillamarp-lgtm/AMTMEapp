import { sendEmail } from '@/lib/email/send-email';

describe('sendEmail', () => {
  it('sends welcome email successfully', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'welcome',
      subject: 'Welcome to AMTMEapp',
      variables: {
        userName: 'Alice',
        loginUrl: 'https://app.local/login',
      },
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it('sends password-reset email successfully', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'password-reset',
      subject: 'Reset your password',
      variables: {
        resetUrl: 'https://app.local/reset?token=abc123',
        expiresIn: '1 hour',
      },
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });

  it('sends audit-alert email successfully', async () => {
    const result = await sendEmail({
      to: 'admin@example.com',
      templateId: 'audit-alert',
      subject: 'Security Alert',
      variables: {
        eventType: 'LEGACY_MIGRATION_COMPLETED',
        summary: 'Migration completed successfully at 2026-05-27 14:00:00',
        dashboardUrl: 'https://app.local/dashboard/audit',
      },
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });

  it('rejects invalid email format', async () => {
    const result = await sendEmail({
      to: 'not-an-email',
      templateId: 'welcome',
      subject: 'Welcome',
      variables: { userName: 'Alice', loginUrl: 'https://app.local/login' },
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_EMAIL');
    expect(result.error).toContain('Invalid email format');
  });

  it('rejects email exceeding 255 characters', async () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    const result = await sendEmail({
      to: longEmail,
      templateId: 'welcome',
      subject: 'Welcome',
      variables: { userName: 'Alice', loginUrl: 'https://app.local/login' },
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_EMAIL');
  });

  it('rejects unknown templateId', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'unknown' as never,
      subject: 'Test',
      variables: {},
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_TEMPLATE');
    expect(result.error).toContain('Invalid template ID');
  });

  it('rejects missing subject', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'welcome',
      subject: '',
      variables: { userName: 'Alice', loginUrl: 'https://app.local/login' },
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_EMAIL');
  });

  it('rejects subject exceeding 200 characters', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'welcome',
      subject: 'a'.repeat(201),
      variables: { userName: 'Alice', loginUrl: 'https://app.local/login' },
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_EMAIL');
  });

  it('rejects non-object variables', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'welcome',
      subject: 'Welcome',
      variables: 'not-an-object' as never,
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_EMAIL');
  });

  it('returns timestamp in ISO 8601 format', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'welcome',
      subject: 'Welcome',
      variables: { userName: 'Alice', loginUrl: 'https://app.local/login' },
    });

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
