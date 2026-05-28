import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send-email';
import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';

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

    // Verify user is authenticated
    const supabase = await getSupabaseAuthServerClient();
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication service not configured',
          code: 'CONFIG_ERROR',
        },
        { status: 500 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
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

    // Security: Verify recipient email matches authenticated user
    // Users can only send to their own email address
    if (to !== user.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'You can only send emails to your registered email address',
          code: 'FORBIDDEN',
        },
        { status: 403 }
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
