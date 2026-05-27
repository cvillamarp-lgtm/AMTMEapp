import { Resend } from 'resend';

let cachedResendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (cachedResendClient) {
    return cachedResendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not configured');
  }

  cachedResendClient = new Resend(apiKey);
  return cachedResendClient;
}
