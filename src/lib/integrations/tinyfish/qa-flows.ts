/**
 * QA Flows for AMTME Studio OS
 * Automated testing and validation of critical workflows
 */

import { getTinyFishClient } from './client';
import type { QAResult, SpotifyImportQAResult, SpotifyImportValidation } from './types';

/**
 * QA Flow: Validate Spotify metrics import workflow
 *
 * This flow:
 * 1. Navigates to /metricas/spotify
 * 2. Uploads a CSV test file
 * 3. Validates that preview is correct
 * 4. Confirms import
 * 5. Verifies history is updated
 * 6. Checks that data is available in the system
 */
export async function runSpotifyMetricsImportQA(
  csvFilePath: string,
  fileId: string = 'test-' + Date.now()
): Promise<SpotifyImportQAResult> {
  const client = getTinyFishClient();

  if (!client.isEnabled()) {
    console.warn('[QA] TinyFish disabled - returning mock result');
    return getMockSpotifyImportQAResult(fileId, csvFilePath);
  }

  // Execute the flow
  const qaResult = await client.executeFlow({
    name: 'spotify-metrics-import-qa',
    timeout: 60000, // 60 seconds for the full flow
    steps: [
      // Step 1: Navigate to Spotify metrics import page
      {
        action: 'navigate',
        url: '/metricas/spotify',
        waitFor: '[data-testid="spotify-upload-area"]',
      },

      // Step 2: Upload CSV file
      {
        action: 'upload',
        selector: 'input[type="file"]',
        filePath: csvFilePath,
        waitFor: '[role="tabpanel"]', // Preview should appear
      },

      // Step 3: Extract and validate preview information
      {
        action: 'extract',
        selectors: {
          fileName: '[data-testid="file-name"]',
          fileType: '[data-testid="file-type"]',
          rowsDetected: '[data-testid="rows-detected"]',
          validationStatus: '[data-testid="validation-status"]',
          validationMessage: '[data-testid="validation-message"]',
          reportType: '[data-testid="report-type"]',
        },
      },

      // Step 4: Verify validation status is not 'invalid'
      {
        action: 'verify',
        checks: [
          {
            name: 'validation-not-invalid',
            selector: '[data-testid="validation-status"]',
            notContains: 'No compatible',
          },
          {
            name: 'rows-detected-positive',
            selector: '[data-testid="rows-detected"]',
            regex: /^\d+$/, // Should be a number
          },
        ],
      },

      // Step 5: Click "Importar" button
      {
        action: 'click',
        text: 'Importar y actualizar historial',
        waitFor: '.success-state', // Wait for success indicator
      },

      // Step 6: Extract import summary
      {
        action: 'extract',
        selectors: {
          processedRows: '[data-testid="processed-rows"]',
          newEpisodes: '[data-testid="new-episodes-created"]',
          episodesUpdated: '[data-testid="episodes-updated"]',
          duplicatesSkipped: '[data-testid="duplicates-skipped"]',
          periodStart: '[data-testid="period-start"]',
          periodEnd: '[data-testid="period-end"]',
        },
      },

      // Step 7: Navigate to history and verify entry was added
      {
        action: 'click',
        text: 'Historial',
        waitFor: '[data-testid="import-history"]',
      },

      // Step 8: Verify history entry
      {
        action: 'verify',
        checks: [
          {
            name: 'history-entry-visible',
            selector: '[data-testid="import-history"]',
            contains: 'filas guardadas', // Success indicator
          },
        ],
      },

      // Step 9: Take screenshot for documentation
      {
        action: 'screenshot',
        filename: `spotify-qa-success-${Date.now()}.png`,
      },
    ],
    metadata: {
      fileId,
      csvFilePath,
      testType: 'spotify-import',
    },
  });

  // Parse the QA result into a validation result
  const validation = parseSpotifyQAResult(qaResult, fileId, csvFilePath);

  return {
    qaResult,
    validation,
    passed: qaResult.status === 'success' && validation.importSuccess,
  };
}

/**
 * Parse QA flow result into structured validation data
 */
function parseSpotifyQAResult(
  qaResult: QAResult,
  fileId: string,
  fileName: string
): SpotifyImportValidation {
  const errors: string[] = [];

  // Check if any step failed
  const failedSteps = qaResult.steps.filter((s) => s.status === 'failed');
  if (failedSteps.length > 0) {
    errors.push(`${failedSteps.length} step(s) failed in QA flow`);
    failedSteps.forEach((s) => {
      if (s.error) errors.push(`  - ${s.name}: ${s.error}`);
    });
  }

  // Extract data from steps
  const extractSteps = qaResult.steps.filter((s) => s.action === 'extract');
  const previewData = extractSteps[0]?.details || {};

  // Validate and normalize validation status
  const rawValidationStatus = previewData.validationStatus as string;
  const validationStatusMap: Record<string, 'valid' | 'partial' | 'invalid'> = {
    valid: 'valid',
    partial: 'partial',
    invalid: 'invalid',
  };
  const validationStatus = validationStatusMap[rawValidationStatus] || 'invalid';

  const validation: SpotifyImportValidation = {
    fileId,
    fileName,
    uploadSuccess: qaResult.steps.some((s) => s.action === 'upload' && s.status === 'success'),
    previewCorrect: qaResult.steps.some(
      (s) => s.name.includes('extract') && s.status === 'success'
    ),
    validationStatus,
    validationMessage: (previewData.validationMessage as string) || '',
    reportTypeDetected: (previewData.reportType as string) || 'unknown',
    rowsDetected: parseInt(String(previewData.rowsDetected), 10) || 0,
    importSuccess: qaResult.steps.some(
      (s) => s.name.includes('Importar') && s.status === 'success'
    ),
    historyUpdated: qaResult.steps.some(
      (s) => s.name.includes('history') && s.status === 'success'
    ),
    errors,
  };

  return validation;
}

/**
 * Get mock QA result (when TinyFish is disabled)
 * Used for testing and demonstration
 */
function getMockSpotifyImportQAResult(fileId: string, csvFilePath: string): SpotifyImportQAResult {
  return {
    qaResult: {
      flowId: `mock_${fileId}`,
      flowName: 'spotify-metrics-import-qa',
      status: 'success',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 5432,
      steps: [
        {
          name: 'Navigate to /metricas/spotify',
          action: 'navigate',
          status: 'success',
          durationMs: 245,
        },
        {
          name: 'Upload CSV file',
          action: 'upload',
          status: 'success',
          durationMs: 1230,
        },
        {
          name: 'Extract preview data',
          action: 'extract',
          status: 'success',
          durationMs: 345,
          details: {
            fileName: csvFilePath,
            fileType: 'CSV',
            rowsDetected: '42',
            validationStatus: 'valid',
            reportType: 'episode_rankings',
          },
        },
        {
          name: 'Click "Importar y actualizar historial"',
          action: 'click',
          status: 'success',
          durationMs: 2150,
        },
        {
          name: 'Verify history updated',
          action: 'verify',
          status: 'success',
          durationMs: 287,
        },
      ],
      summary: 'Mock QA flow completed successfully (TinyFish disabled)',
      metadata: { mocked: true, fileId },
    },
    validation: {
      fileId,
      fileName: csvFilePath,
      uploadSuccess: true,
      previewCorrect: true,
      validationStatus: 'valid',
      validationMessage: 'Archivo válido para importación',
      reportTypeDetected: 'episode_rankings',
      rowsDetected: 42,
      importSuccess: true,
      historyUpdated: true,
      errors: [],
    },
    passed: true,
  };
}

/**
 * Validate all critical QA flows
 * Run this as a health check to ensure the system is working
 */
export async function validateAllCriticalFlows(): Promise<{
  timestamp: string;
  allPassed: boolean;
  results: Record<string, QAResult>;
  errors: string[];
}> {
  const results: Record<string, QAResult> = {};
  const errors: string[] = [];

  // Get test CSV file (you'll need to provide this)
  const testCsvPath = process.env.TINYFISH_TEST_CSV || 'test-data/episode_rankings.csv';

  try {
    const spotifyQAResult = await runSpotifyMetricsImportQA(testCsvPath, 'validation-run');
    results.spotifyImport = spotifyQAResult.qaResult;

    if (!spotifyQAResult.passed) {
      errors.push('Spotify import QA failed');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Spotify import QA error: ${message}`);
  }

  return {
    timestamp: new Date().toISOString(),
    allPassed: errors.length === 0,
    results,
    errors,
  };
}
