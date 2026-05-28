import { getResendClient } from './resend-client';
import { WelcomeEmail } from './templates/welcome';
import { PasswordResetEmail } from './templates/password-reset';
import { AuditAlertEmail } from './templates/audit-alert';

export interface SendEmailOptions {
  to: string;
  templateId: 'welcome' | 'password-reset' | 'audit-alert';
  subject: string;
  variables: Record<string, string | number | boolean | null | undefined>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  code?: string;
  timestamp: string;
}

enum EmailErrorCode {
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_TEMPLATE = 'INVALID_TEMPLATE',
  RENDER_ERROR = 'RENDER_ERROR',
  RESEND_ERROR = 'RESEND_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/[a-z0-9]([a-z0-9-]*\.)*[a-z0-9-]*\.[a-z]{2,}(\/[^\s]*)?$/i;
const ALLOWED_TEMPLATES = ['welcome', 'password-reset', 'audit-alert'] as const;

function isValidUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.length > 2048) return false;
  return URL_REGEX.test(url);
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const timestamp = new Date().toISOString();

  try {
    // Validate email
    if (!options.to || typeof options.to !== 'string') {
      return {
        success: false,
        error: 'Email is required',
        code: EmailErrorCode.INVALID_EMAIL,
        timestamp,
      };
    }

    if (!EMAIL_REGEX.test(options.to) || options.to.length > 255) {
      return {
        success: false,
        error: 'Invalid email format',
        code: EmailErrorCode.INVALID_EMAIL,
        timestamp,
      };
    }

    // Validate templateId
    if (!ALLOWED_TEMPLATES.includes(options.templateId)) {
      return {
        success: false,
        error: `Invalid template ID. Allowed: ${ALLOWED_TEMPLATES.join(', ')}`,
        code: EmailErrorCode.INVALID_TEMPLATE,
        timestamp,
      };
    }

    // Validate subject
    if (!options.subject || typeof options.subject !== 'string' || options.subject.length > 200) {
      return {
        success: false,
        error: 'Subject is required and must be under 200 characters',
        code: EmailErrorCode.INVALID_EMAIL,
        timestamp,
      };
    }

    // Validate variables
    if (typeof options.variables !== 'object' || options.variables === null) {
      return {
        success: false,
        error: 'Variables must be an object',
        code: EmailErrorCode.INVALID_EMAIL,
        timestamp,
      };
    }

    // Render template
    let emailComponent: React.ReactElement;

    try {
      switch (options.templateId) {
        case 'welcome':
          if (!isValidUrl(options.variables.loginUrl as string)) {
            return {
              success: false,
              error: 'Invalid loginUrl in variables',
              code: EmailErrorCode.INVALID_EMAIL,
              timestamp,
            };
          }
          emailComponent = WelcomeEmail({
            userName: String(options.variables.userName || ''),
            loginUrl: String(options.variables.loginUrl || ''),
          });
          break;
        case 'password-reset':
          if (!isValidUrl(options.variables.resetUrl as string)) {
            return {
              success: false,
              error: 'Invalid resetUrl in variables',
              code: EmailErrorCode.INVALID_EMAIL,
              timestamp,
            };
          }
          emailComponent = PasswordResetEmail({
            resetUrl: String(options.variables.resetUrl || ''),
            expiresIn: String(options.variables.expiresIn || ''),
          });
          break;
        case 'audit-alert':
          if (!isValidUrl(options.variables.dashboardUrl as string)) {
            return {
              success: false,
              error: 'Invalid dashboardUrl in variables',
              code: EmailErrorCode.INVALID_EMAIL,
              timestamp,
            };
          }
          emailComponent = AuditAlertEmail({
            eventType: String(options.variables.eventType || ''),
            summary: String(options.variables.summary || ''),
            dashboardUrl: String(options.variables.dashboardUrl || ''),
          });
          break;
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to render template: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: EmailErrorCode.RENDER_ERROR,
        timestamp,
      };
    }

    // Send via Resend
    const resend = getResendClient();
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@amtmeapp.com',
      to: options.to,
      subject: options.subject,
      react: emailComponent,
    });

    if (response.error) {
      return {
        success: false,
        error: `Resend error: ${response.error.message}`,
        code: EmailErrorCode.RESEND_ERROR,
        timestamp,
      };
    }

    return {
      success: true,
      messageId: response.data?.id,
      timestamp,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      code: EmailErrorCode.RESEND_ERROR,
      timestamp,
    };
  }
}
