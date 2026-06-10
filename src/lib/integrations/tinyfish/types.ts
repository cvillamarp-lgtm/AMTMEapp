/**
 * TinyFish Integration Type Definitions
 */

/**
 * Status of a QA validation run
 */
export type QAStatus = 'pending' | 'running' | 'success' | 'partial' | 'failed';

/**
 * Result of a QA flow execution
 */
export interface QAResult {
  flowId: string;
  flowName: string;
  status: QAStatus;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  steps: QAStep[];
  summary: string;
  error?: string;
  metadata: Record<string, unknown>;
}

/**
 * Individual step in a QA flow
 */
export interface QAStep {
  name: string;
  action: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  durationMs: number;
  details?: Record<string, unknown>;
  error?: string;
}

/**
 * Spotify Import Validation Result
 */
export interface SpotifyImportValidation {
  fileId: string;
  fileName: string;
  uploadSuccess: boolean;
  previewCorrect: boolean;
  validationStatus: 'valid' | 'partial' | 'invalid';
  validationMessage: string;
  reportTypeDetected: string;
  rowsDetected: number;
  importSuccess: boolean;
  historyUpdated: boolean;
  errors: string[];
}

/**
 * Result of a complete Spotify metrics import QA flow
 */
export interface SpotifyImportQAResult {
  qaResult: QAResult;
  validation: SpotifyImportValidation;
  passed: boolean;
}

/**
 * TinyFish flow execution request
 */
export interface TinyFishFlowRequest {
  name: string;
  timeout: number;
  steps: TinyFishStep[];
  metadata?: Record<string, unknown>;
}

/**
 * Individual step in a TinyFish flow
 */
export interface TinyFishStep {
  action:
    | 'navigate'
    | 'upload'
    | 'click'
    | 'type'
    | 'wait'
    | 'extract'
    | 'verify'
    | 'screenshot'
    | 'scroll';
  [key: string]: unknown;
}

/**
 * Error thrown by TinyFish operations
 */
export class TinyFishError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'TinyFishError';
  }
}

/**
 * Error thrown when TinyFish is disabled
 */
export class TinyFishDisabledError extends TinyFishError {
  constructor() {
    super('TinyFish automation is disabled', 'TINYFISH_DISABLED');
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class TinyFishConfigError extends TinyFishError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFIG_ERROR', details);
  }
}

/**
 * Error thrown when a flow execution times out
 */
export class TinyFishTimeoutError extends TinyFishError {
  constructor(flowName: string, timeoutMs: number) {
    super(`Flow "${flowName}" exceeded timeout of ${timeoutMs}ms`, 'TIMEOUT', {
      flowName,
      timeoutMs,
    });
  }
}
