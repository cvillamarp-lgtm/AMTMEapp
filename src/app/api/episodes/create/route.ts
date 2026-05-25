import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/core/api/withMiddleware';
import { ValidationService } from '@/lib/core/validation/ValidationService';
import { ApiResponseService } from '@/lib/core/api/ApiResponseService';
import { AppError } from '@/lib/core/errors/AppError';
import { logger } from '@/lib/core/logging/logger';
import { getRequestContext } from '@/lib/core/telemetry/RequestContext';

// Define request schema
const CreateEpisodeSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  topic: z.string().min(3).max(100),
  duration: z.number().int().min(60).max(3600),
  tags: z.array(z.string()).min(1).max(10),
});

type CreateEpisodeRequest = z.infer<typeof CreateEpisodeSchema>;

interface EpisodeResponse {
  id: string;
  title: string;
  status: 'draft' | 'processing' | 'published';
  createdAt: string;
}

async function handler(request: NextRequest): Promise<NextResponse> {
  const context = getRequestContext();

  // Only allow POST
  if (request.method !== 'POST') {
    throw AppError.validation('Method not allowed', {
      endpoint: '/api/episodes/create',
    });
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = ValidationService.validate<CreateEpisodeRequest>(
      CreateEpisodeSchema,
      body,
      'create-episode-request'
    );

    logger.info('Episode creation request validated', {
      requestId: context?.requestId,
      metadata: { title: validatedData.title },
    });

    // Check if episode already exists (example business logic)
    if (validatedData.title.toLowerCase().includes('test')) {
      throw AppError.conflict('An episode with this title already exists', {
        requestId: context?.requestId,
        endpoint: '/api/episodes/create',
        metadata: { title: validatedData.title },
      });
    }

    // Simulate episode creation
    const episodeId = `ep_${Date.now()}`;
    const response: EpisodeResponse = {
      id: episodeId,
      title: validatedData.title,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    logger.info('Episode created successfully', {
      requestId: context?.requestId,
      metadata: { episodeId, title: validatedData.title },
    });

    return ApiResponseService.created(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw AppError.internal('Failed to create episode', {
      requestId: context?.requestId,
    });
  }
}

// Wrap with all middleware
export const POST = apiHandler(handler);
