import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send-email';
import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('[Email API] Email service is not configured');

      return NextResponse.json(
        {
          success: false,
          error: 'Email service unavailable',
          code: 'CONFIG_ERROR',
        },
        { status: 503 }
      );
    }

    // Verify user is authenticated
    const supabase = await getSupabaseAuthServerClient();
    if (!supabase) {
      console.error('[Email API] Authentication service is not configured');

      return NextResponse.json(
        {
          success: false,
          error: 'Email request could not be processed',
          code: 'CONFIG_ERROR',
        },
        { status: 503 }
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

      if (statusCode >= 500) {
        console.error('[Email API] Email delivery failed', {
          code: result.code,
          message: result.error,
        });

        return NextResponse.json(
          {
            success: false,
            error: 'Email request could not be processed',
            code: result.code || 'EMAIL_DELIVERY_ERROR',
          },
          { status: statusCode }
        );
      }

      return NextResponse.json(result, { status: statusCode });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[Email API] Request failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Email request could not be processed',
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
