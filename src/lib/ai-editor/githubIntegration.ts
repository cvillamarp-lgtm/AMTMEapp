import { Buffer } from 'node:buffer';
import type { AiChangePlan } from './types';

type GitHubConfig = {
  token: string;
  owner: string;
  repo: string;
  baseBranch: string;
};

export type GitHubIntegrationResult = {
  executionSource: 'github_api' | 'simulation';
  branchName: string;
  branchType: 'real' | 'proposed';
  commitSha?: string;
  message: string;
  diffAppliedToFiles: boolean;
  evidenceUrl?: string;
  rollbackMetadata?: {
    strategy: string;
    patchFilePath?: string;
    details?: string;
  };
};

type GitHubRefResponse = { object: { sha: string } };

type GitHubContentResponse = {
  content?: string;
  sha?: string;
  commit?: { sha?: string };
};

function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.AI_EDITOR_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  const owner = process.env.AI_EDITOR_GITHUB_OWNER;
  const repo = process.env.AI_EDITOR_GITHUB_REPO;
  const baseBranch = process.env.AI_EDITOR_GITHUB_BASE_BRANCH ?? 'main';

  if (!token || !owner || !repo) {
    return null;
  }

  return { token, owner, repo, baseBranch };
}

async function githubRequest<T>(
  config: GitHubConfig,
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`GitHub API ${response.status}: ${details || response.statusText}`);
  }

  return (await response.json()) as T;
}

function toPatchArtifact(plan: AiChangePlan, requestId: string, prompt?: string): string {
  return JSON.stringify(
    {
      requestId,
      prompt: prompt ?? '',
      generatedAt: new Date().toISOString(),
      intent: plan.intent,
      summary: plan.summary,
      files: plan.affectedFiles,
      diff: plan.diff,
      note: 'Este archivo es un artefacto de patch para trazabilidad operativa del Editor IA.',
    },
    null,
    2
  );
}

export async function prepareGitHubChange(
  plan: AiChangePlan,
  requestId: string,
  prompt?: string
): Promise<GitHubIntegrationResult> {
  const proposedBranch = `ai-editor/${requestId.slice(0, 8)}`;
  const config = getGitHubConfig();

  if (!config) {
    return {
      executionSource: 'simulation',
      branchName: proposedBranch,
      branchType: 'proposed',
      message:
        'Integración GitHub no configurada. Se dejó rama propuesta sin crear branch/commit real.',
      diffAppliedToFiles: false,
    };
  }

  const patchFilePath = `.ai-editor/requests/${requestId}.json`;

  try {
    const baseRef = await githubRequest<GitHubRefResponse>(
      config,
      `/repos/${config.owner}/${config.repo}/git/ref/heads/${encodeURIComponent(config.baseBranch)}`
    );

    const baseSha = baseRef.object.sha;
    let branchCreated = false;

    try {
      await githubRequest(config, `/repos/${config.owner}/${config.repo}/git/refs`, {
        method: 'POST',
        body: JSON.stringify({
          ref: `refs/heads/${proposedBranch}`,
          sha: baseSha,
        }),
      });
      branchCreated = true;
    } catch {
      // branch may already exist; continue and attempt commit
    }

    const content = Buffer.from(toPatchArtifact(plan, requestId, prompt), 'utf-8').toString(
      'base64'
    );
    const commit = await githubRequest<GitHubContentResponse>(
      config,
      `/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(patchFilePath)}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          message: `chore(ai-editor): registrar patch ${requestId}`,
          content,
          branch: proposedBranch,
        }),
      }
    );

    const commitSha = commit.commit?.sha;

    return {
      executionSource: 'github_api',
      branchName: proposedBranch,
      branchType: 'real',
      commitSha,
      message: branchCreated
        ? 'Rama y commit reales creados en GitHub. Se registró el patch como artefacto trazable.'
        : 'Rama existente reutilizada y commit real creado en GitHub con artefacto de patch.',
      diffAppliedToFiles: false,
      evidenceUrl: `https://github.com/${config.owner}/${config.repo}/tree/${proposedBranch}`,
      rollbackMetadata: {
        strategy: 'delete_patch_artifact',
        patchFilePath,
        details: 'Rollback elimina artefacto del patch en la rama técnica.',
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return {
      executionSource: 'simulation',
      branchName: proposedBranch,
      branchType: 'proposed',
      message: `No se pudo completar integración GitHub: ${message}`,
      diffAppliedToFiles: false,
    };
  }
}

export async function rollbackGitHubChange(input: {
  branchName: string;
  requestId: string;
  rollbackMetadata?: { strategy?: string; patchFilePath?: string };
}): Promise<{
  success: boolean;
  rollbackType: 'discard' | 'revert';
  restoredFiles: string[];
  message: string;
  rollbackCommitSha?: string;
}> {
  const config = getGitHubConfig();
  const patchFilePath = input.rollbackMetadata?.patchFilePath;

  if (!config || input.rollbackMetadata?.strategy !== 'delete_patch_artifact' || !patchFilePath) {
    return {
      success: false,
      rollbackType: 'discard',
      restoredFiles: [],
      message: 'Rollback real no disponible sin metadata de artefacto y configuración GitHub.',
    };
  }

  try {
    const contentResponse = await githubRequest<GitHubContentResponse>(
      config,
      `/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(patchFilePath)}?ref=${encodeURIComponent(input.branchName)}`
    );

    if (!contentResponse.sha) {
      return {
        success: false,
        rollbackType: 'discard',
        restoredFiles: [],
        message: 'No se encontró el artefacto para revertir en la rama indicada.',
      };
    }

    const result = await githubRequest<GitHubContentResponse>(
      config,
      `/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(patchFilePath)}`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          message: `revert(ai-editor): rollback ${input.requestId}`,
          sha: contentResponse.sha,
          branch: input.branchName,
        }),
      }
    );

    return {
      success: true,
      rollbackType: 'revert',
      restoredFiles: [patchFilePath],
      message: 'Rollback real ejecutado en GitHub eliminando el artefacto del patch.',
      rollbackCommitSha: result.commit?.sha,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      rollbackType: 'discard',
      restoredFiles: [],
      message: `Falló rollback real en GitHub: ${message}`,
    };
  }
}

export async function getCiWorkflowEvidence(): Promise<{
  source: 'github_actions' | 'deferred_ci';
  url?: string;
}> {
  const owner = process.env.AI_EDITOR_GITHUB_OWNER;
  const repo = process.env.AI_EDITOR_GITHUB_REPO;
  if (!owner || !repo) {
    return { source: 'deferred_ci' };
  }

  return {
    source: 'github_actions',
    url: `https://github.com/${owner}/${repo}/actions/workflows/ci.yml`,
  };
}
