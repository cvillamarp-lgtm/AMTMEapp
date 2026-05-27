import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send-email';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'RESEND_API_KEY environment variable is not configured',
          code: 'CONFIG_ERROR',
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const { to, templateId, subject, variables } = body;

    // Basic request validation
    if (!to || !templateId || !subject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: to, templateId, subject',
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendEmail({
      to,
      templateId,
      subject,
      variables: variables || {},
    });

    // Return 400 for validation errors, 500 for server errors
    if (!result.success) {
      const statusCode =
        result.code === 'INVALID_EMAIL' || result.code === 'INVALID_TEMPLATE' ? 400 : 500;
      return NextResponse.json(result, { status: statusCode });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
