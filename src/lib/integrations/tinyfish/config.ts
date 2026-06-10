/**
 * TinyFish Integration Configuration
 * Handles environment variables, feature flags, and initialization
 */

export interface TinyFishConfig {
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
  timeoutMs: number;
}

export function getTinyFishConfig(): TinyFishConfig {
  const enabled = process.env.ENABLE_TINYFISH_AUTOMATION === 'true';
  const apiKey = process.env.TINYFISH_API_KEY || '';
  const baseUrl = process.env.TINYFISH_BASE_URL || 'https://api.tinyfish.io';

  const parsedTimeout = parseInt(process.env.TINYFISH_TIMEOUT_MS || '30000', 10);
  const timeoutMs = isNaN(parsedTimeout) ? 30000 : parsedTimeout;

  return {
    apiKey,
    baseUrl,
    enabled,
    timeoutMs,
  };
}

export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (process.env.ENABLE_TINYFISH_AUTOMATION === 'true') {
    if (!process.env.TINYFISH_API_KEY) {
      errors.push('TINYFISH_API_KEY is required when ENABLE_TINYFISH_AUTOMATION=true');
    }
    if (!process.env.TINYFISH_BASE_URL && !process.env.TINYFISH_API_KEY) {
      errors.push('Either TINYFISH_BASE_URL or a valid TINYFISH_API_KEY must be configured');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
