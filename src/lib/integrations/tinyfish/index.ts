/**
 * TinyFish Integration - Public API
 * Export all TinyFish services and utilities
 */

// Config
export { getTinyFishConfig, validateConfig } from './config';
export type { TinyFishConfig } from './config';

// Client
export { TinyFishClient, getTinyFishClient, resetTinyFishClient } from './client';

// QA Flows
export { runSpotifyMetricsImportQA, validateAllCriticalFlows } from './qa-flows';

// Types
export {
  TinyFishError,
  TinyFishDisabledError,
  TinyFishConfigError,
  TinyFishTimeoutError,
} from './types';

export type {
  QAStatus,
  QAResult,
  QAStep,
  SpotifyImportValidation,
  SpotifyImportQAResult,
  TinyFishFlowRequest,
  TinyFishStep,
} from './types';
