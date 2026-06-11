/**
 * TinyFish Client - Main integration layer
 * Handles communication with TinyFish API and executes flows
 */

import { getTinyFishConfig, validateConfig } from './config';
import {
  TinyFishDisabledError,
  TinyFishConfigError,
  type QAResult,
  type TinyFishFlowRequest,
  type QAStep,
} from './types';

let clientInstance: TinyFishClient | null = null;

export class TinyFishClient {
  private config = getTinyFishConfig();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const validation = validateConfig();
    if (!validation.valid) {
      // Log warnings but don't fail if TinyFish is disabled
      if (this.config.enabled) {
        console.warn('[TinyFish] Configuration errors:', validation.errors);
      }
    }
    this.isInitialized = true;
  }

  /**
   * Check if TinyFish is enabled and properly configured
   */
  isEnabled(): boolean {
    return this.config.enabled && this.config.apiKey !== '';
  }

  /**
   * Execute a TinyFish flow
   */
  async executeFlow(request: TinyFishFlowRequest): Promise<QAResult> {
    if (!this.isEnabled()) {
      throw new TinyFishDisabledError();
    }

    if (!this.config.apiKey) {
      throw new TinyFishConfigError('TINYFISH_API_KEY is not configured');
    }

    const startedAt = new Date().toISOString();
    const startTime = Date.now();
    const steps: QAStep[] = [];

    try {
      // Simulate flow execution (replace with actual API call)
      for (const step of request.steps) {
        const stepStart = Date.now();
        const stepName = `${step.action}${step.selector ? ` (${step.selector as string})` : ''}`;

        try {
          // Mock execution - in real implementation, this would call TinyFish API
          const stepResult = await this.executeStep(step);

          steps.push({
            name: stepName,
            action: step.action as string,
            status: 'success',
            durationMs: Date.now() - stepStart,
            details: stepResult,
          });
        } catch (error) {
          steps.push({
            name: stepName,
            action: step.action as string,
            status: 'failed',
            durationMs: Date.now() - stepStart,
            error: error instanceof Error ? error.message : String(error),
          });

          throw error;
        }
      }

      const durationMs = Date.now() - startTime;
      const completedAt = new Date().toISOString();

      return {
        flowId: `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        flowName: request.name,
        status: 'success',
        startedAt,
        completedAt,
        durationMs,
        steps,
        summary: `Flow "${request.name}" completed successfully in ${durationMs}ms`,
        metadata: request.metadata || {},
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const completedAt = new Date().toISOString();
      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        flowId: `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        flowName: request.name,
        status: 'failed',
        startedAt,
        completedAt,
        durationMs,
        steps,
        summary: `Flow "${request.name}" failed: ${errorMessage}`,
        error: errorMessage,
        metadata: request.metadata || {},
      };
    }
  }

  /**
   * Execute a single step (mock implementation)
   */
  private async executeStep(step: Record<string, unknown>): Promise<Record<string, unknown>> {
    const action = step.action as string;

    // Mock delay to simulate browser automation
    await new Promise((resolve) => setTimeout(resolve, 100));

    switch (action) {
      case 'navigate':
        return { navigated: true, url: step.url };
      case 'upload':
        return { uploaded: true, filePath: step.filePath };
      case 'click':
        return { clicked: true, selector: step.selector };
      case 'wait':
        return { waited: true, selector: step.selector };
      case 'extract':
        return { extracted: true, data: {} };
      case 'verify':
        return { verified: true, checks: step.checks };
      default:
        return { executed: true, action };
    }
  }

  /**
   * Log a message (never logs API keys or sensitive data)
   */
  private log(level: 'info' | 'warn' | 'error', message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const logMessage = `[TinyFish ${timestamp}] ${message}`;

    if (level === 'error') {
      console.error(logMessage, data);
    } else if (level === 'warn') {
      console.warn(logMessage, data);
    } else {
    }
  }
}

/**
 * Get or create the singleton TinyFish client
 */
export function getTinyFishClient(): TinyFishClient {
  if (!clientInstance) {
    clientInstance = new TinyFishClient();
  }
  return clientInstance;
}

/**
 * Reset the client (for testing)
 */
export function resetTinyFishClient() {
  clientInstance = null;
}
