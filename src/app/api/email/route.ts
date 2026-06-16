import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Email validation schema
const newsletterSchema = z.object({
  type: z.literal('newsletter'),
  email: z.string().email(),
});

const lecturaSchema = z.object({
  type: z.literal('lectura-tarot'),
  name: z.string().min(1),
  email: z.string().email(),
  situation: z.string().min(10),
  question: z.string().optional(),
  payment_method: z.string().optional(),
});

type NewsletterData = z.infer<typeof newsletterSchema>;
type LecturaData = z.infer<typeof lecturaSchema>;

async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Email API] RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'noreply@amitampocomeexplicaron.com',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Email API] Resend error', error);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('[Email API] Error sending email', error);
    return { success: false, error: 'Email delivery error' };
  }
}

async function handleNewsletter(data: NewsletterData): Promise<Response> {
  // Send confirmation to user
  const userEmailHtml = `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0c1f36;">
        <p>Gracias por suscribirte a AMTME.</p>
        <p>Esta será una carta breve, íntima y sin ruido. Sin spam, siempre.</p>
        <p>Próximo envío en dos semanas.</p>
        <p>— Christian</p>
      </body>
    </html>
  `;

  await sendEmailViaResend(data.email, 'Bienvenida a AMTME', userEmailHtml);

  // Send notification to admin
  const adminEmail = process.env.AMTME_CONTACT_EMAIL || 'c.villamarp@gmail.com';
  const adminEmailHtml = `
    <html>
      <body style="font-family: monospace;">
        <h2>Nueva suscripción newsletter</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </body>
    </html>
  `;

  await sendEmailViaResend(adminEmail, 'Nueva suscripción newsletter — AMTME', adminEmailHtml);

  return NextResponse.json({ success: true }, { status: 200 });
}

async function handleLectura(data: LecturaData): Promise<Response> {
  // Send confirmation to user
  const userEmailHtml = `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0c1f36;">
        <p>Gracias por solicitar tu lectura simbólica.</p>
        <p>Recibí tu mensaje. Te responderé personalmente con los detalles de pago y el siguiente paso.</p>
        <p>Que esperes esta lectura con claridad, no con ansiedad.</p>
        <p>— Christian</p>
      </body>
    </html>
  `;

  await sendEmailViaResend(data.email, 'Tu lectura simbólica — AMTME', userEmailHtml);

  // Send notification to admin
  const adminEmail = process.env.AMTME_CONTACT_EMAIL || 'c.villamarp@gmail.com';
  const adminEmailHtml = `
    <html>
      <body style="font-family: monospace;">
        <h2>Nueva solicitud de lectura simbólica</h2>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Situación:</strong></p>
        <pre>${data.situation}</pre>
        <p><strong>Pregunta:</strong></p>
        <pre>${data.question || 'Lectura general'}</pre>
        <p><strong>Método de pago:</strong> ${data.payment_method || 'No especificado'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </body>
    </html>
  `;

  await sendEmailViaResend(
    adminEmail,
    'Nueva solicitud de lectura simbólica — AMTME',
    adminEmailHtml
  );

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');

    let data: Record<string, string>;

    if (contentType?.includes('application/json')) {
      data = await request.json();
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      data = {};
      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          data[key] = value;
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported content type' },
        { status: 415 }
      );
    }

    const type = data.type as string;

    // Route to appropriate handler
    if (type === 'newsletter') {
      const validated = newsletterSchema.parse(data);
      return await handleNewsletter(validated);
    } else if (type === 'lectura-tarot') {
      const validated = lecturaSchema.parse(data);
      return await handleLectura(validated);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[Email API] Request failed', error);
    return NextResponse.json(
      { success: false, error: 'Request processing failed' },
      { status: 500 }
    );
  }
}
