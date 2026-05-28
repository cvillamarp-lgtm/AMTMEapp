# Especificación Técnica: Email Delivery con Resend (MVP)

**Estado**: Especificación inicial
**Fecha**: 2026-05-27
**Scope**: Email delivery único servicio legacy aprobado para MVP
**Fase**: 1 (MVP)

---

## 1. Resumen Ejecutivo

AMTMEapp necesita enviar emails transaccionales en MVP:
- Confirmación de registro
- Reset de contraseña
- Notificaciones de integración
- Reportes de auditoría (casos específicos)

**Decisión**: Usar **Resend** como servicio de email único para MVP.
- No implementar: reportes PDF, auto-sync, reportes periódicos
- Scope MVP: transaccionales simples + notificaciones core
- Transición Fase 2: agregar templates complejos, webhooks, bounce handling

---

## 2. Arquitectura Técnica

### 2.1 Componentes

```
src/lib/email/
├── resend-client.ts       # Cliente Resend inicializado
├── send-email.ts          # Función wrapper sendEmail()
└── templates/
    ├── welcome.tsx        # TSX template bienvenida
    ├── password-reset.tsx # TSX template reset
    └── audit-alert.tsx    # TSX template alertas auditoría

src/app/api/email/
└── route.ts               # POST /api/email — envío desde API

tests/
├── unit/
│   └── lib/email/send-email.test.ts
└── integration/
    └── api/email.test.ts
```

### 2.2 Flujo de Datos

```
1. Trigger (server action / API route)
   ↓
2. Validar destinatario + tipo de email
   ↓
3. Renderizar template TSX → HTML
   ↓
4. Enviar vía Resend SDK
   ↓
5. Capturar response (id, error)
   ↓
6. Retornar { success, messageId, error }
```

---

## 3. Variables de Entorno

### Requeridas (MVP)

```env
# .env.local (development)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@amtmeapp.com
EMAIL_REPLY_TO=support@amtmeapp.com

# .env.production (production)
RESEND_API_KEY=<production-key>
EMAIL_FROM=noreply@amtmeapp.com
EMAIL_REPLY_TO=support@amtmeapp.com
```

### Validación en Startup

```typescript
// En lib/email/resend-client.ts
function validateEmailConfig() {
  const required = ['RESEND_API_KEY', 'EMAIL_FROM', 'EMAIL_REPLY_TO'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
}
```

---

## 4. Rutas API

### POST /api/email

Envío de email desde backend.

**Request**:
```typescript
{
  to: string;              // destinatario@email.com
  templateId: string;      // 'welcome' | 'password-reset' | 'audit-alert'
  subject: string;         // Asunto
  variables: Record<string, any>; // Props para template
}
```

**Response (200)**:
```typescript
{
  success: true;
  messageId: string;       // ID de Resend
  timestamp: string;       // ISO 8601
}
```

**Response (400/500)**:
```typescript
{
  success: false;
  error: string;          // Error description
  code: string;           // 'INVALID_EMAIL' | 'TEMPLATE_ERROR' | 'RESEND_ERROR'
}
```

**Validaciones**:
- Email válido (regex + length check)
- templateId en allowlist ('welcome', 'password-reset', 'audit-alert')
- variables es objeto válido

---

## 5. Templates (TSX)

Usar React para renderizar templates. Resend soporta JSX → HTML.

### 5.1 WelcomeEmail

```typescript
// src/lib/email/templates/welcome.tsx
interface WelcomeEmailProps {
  userName: string;
  loginUrl: string;
}

export const WelcomeEmail = ({ userName, loginUrl }: WelcomeEmailProps) => (
  <div>
    <h1>¡Bienvenido, {userName}!</h1>
    <p>Tu cuenta en AMTMEapp ha sido creada.</p>
    <a href={loginUrl}>Acceder ahora</a>
  </div>
);
```

### 5.2 PasswordResetEmail

```typescript
// src/lib/email/templates/password-reset.tsx
interface PasswordResetEmailProps {
  resetUrl: string;
  expiresIn: string; // ej: "1 hora"
}

export const PasswordResetEmail = ({ resetUrl, expiresIn }: PasswordResetEmailProps) => (
  <div>
    <h1>Reset de Contraseña</h1>
    <p>Solicitud de reset de contraseña en AMTMEapp.</p>
    <p>Este link expira en {expiresIn}.</p>
    <a href={resetUrl}>Reset contraseña</a>
  </div>
);
```

### 5.3 AuditAlertEmail

```typescript
// src/lib/email/templates/audit-alert.tsx
interface AuditAlertEmailProps {
  eventType: string;  // ej: "LEGACY_MIGRATION_COMPLETED"
  summary: string;    // resumen del evento
  dashboardUrl: string;
}

export const AuditAlertEmail = ({ eventType, summary, dashboardUrl }: AuditAlertEmailProps) => (
  <div>
    <h1>Alerta de Auditoría: {eventType}</h1>
    <p>{summary}</p>
    <a href={dashboardUrl}>Ver en dashboard</a>
  </div>
);
```

---

## 6. Función sendEmail()

### Interfaz

```typescript
// src/lib/email/send-email.ts

export interface SendEmailOptions {
  to: string;
  templateId: 'welcome' | 'password-reset' | 'audit-alert';
  subject: string;
  variables: Record<string, any>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
```

### Comportamiento

1. **Validar email**: regex simple + longitud
2. **Validar templateId**: check en allowlist
3. **Renderizar template**: `react-email` o similar
4. **Enviar vía Resend**: `resend.emails.send()`
5. **Capturar response**: extraer `id` o `error`
6. **Retornar resultado**: con timestamp ISO

### Manejo de Errores

```typescript
enum EmailErrorCode {
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_TEMPLATE = 'INVALID_TEMPLATE',
  RENDER_ERROR = 'RENDER_ERROR',
  RESEND_ERROR = 'RESEND_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
}

// En catch blocks:
// - ENOTFOUND, ECONNREFUSED → RESEND_ERROR
// - render error (JSX syntax) → RENDER_ERROR
// - invalid email format → INVALID_EMAIL
// - missing env var → CONFIG_ERROR
```

---

## 7. Seguridad

### Validaciones de Input

```typescript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(options.to)) throw new Error('INVALID_EMAIL');

// Variables
if (typeof options.variables !== 'object') {
  throw new Error('Variables must be object');
}

// Subject
if (!options.subject || options.subject.length > 200) {
  throw new Error('Invalid subject');
}
```

### Rate Limiting

- Implementar en Fase 2 (MVP: sin limite explícito, confiar en Resend)
- Verificar logs de Resend para detectar abuso

### Rate Limiting (Fase 2)

```typescript
// Placeholder: agregar en Fase 2
// - Redis-based counter por (email, type, timestamp)
// - Límites: max 5 resets/hora, max 3 bienvenidas/hora
```

---

## 8. Tests

### Unit Tests: `tests/unit/lib/email/send-email.test.ts`

```typescript
describe('sendEmail', () => {
  it('renders welcome template correctly', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'welcome',
      subject: 'Welcome',
      variables: { userName: 'Alice', loginUrl: 'https://app.local/login' }
    });
    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });

  it('rejects invalid email', async () => {
    const result = await sendEmail({
      to: 'not-an-email',
      templateId: 'welcome',
      subject: 'Welcome',
      variables: {}
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('INVALID_EMAIL');
  });

  it('rejects unknown templateId', async () => {
    const result = await sendEmail({
      to: 'user@example.com',
      templateId: 'unknown' as any,
      subject: 'Test',
      variables: {}
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('INVALID_TEMPLATE');
  });
});
```

### Integration Tests: `tests/integration/api/email.test.ts`

```typescript
describe('POST /api/email', () => {
  it('sends email and returns messageId', async () => {
    const res = await fetch('/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        templateId: 'welcome',
        subject: 'Welcome',
        variables: { userName: 'Bob', loginUrl: 'https://app.local/login' }
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.messageId).toBeDefined();
  });

  it('returns 400 on invalid email', async () => {
    const res = await fetch('/api/email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'invalid-email',
        templateId: 'welcome',
        subject: 'Welcome',
        variables: {}
      })
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });
});
```

---

## 9. Criterio de "Listo" (Definition of Done)

- [ ] `src/lib/email/resend-client.ts` creado y exporta cliente
- [ ] `src/lib/email/send-email.ts` implementado con validaciones
- [ ] Tres templates (welcome, password-reset, audit-alert) en `src/lib/email/templates/`
- [ ] `src/app/api/email/route.ts` implementado con POST handler
- [ ] `.env.example` contiene `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`
- [ ] Unit tests pasan: `npm test -- send-email.test.ts`
- [ ] Integration tests pasan: `npm test -- api/email.test.ts`
- [ ] Build pasa sin errores: `npm run build`
- [ ] Documentación actualizada en `docs/`
- [ ] Verificación manual: enviar email test desde API route
- [ ] No hay references activas a Spark en código
- [ ] Commit creado: `feat: implement email delivery with Resend`

---

## 10. Plan de Implementación

### Fase: MVP (actual)

1. **Setup** (15 min)
   - Instalar `resend` + `react-email`
   - Crear estructura de directorios

2. **Cliente Resend** (10 min)
   - `resend-client.ts`: inicializar con RESEND_API_KEY
   - Validar env vars en startup

3. **Función sendEmail()** (20 min)
   - Implementar validaciones
   - Renderizar template TSX
   - Enviar vía Resend SDK
   - Manejo de errores

4. **Templates** (15 min)
   - welcome.tsx
   - password-reset.tsx
   - audit-alert.tsx

5. **API Route** (15 min)
   - POST /api/email
   - Validar request
   - Llamar sendEmail()
   - Retornar response

6. **Tests** (20 min)
   - Unit tests
   - Integration tests

7. **Validación** (10 min)
   - Build
   - Tests
   - Manual verification

**Total**: ~105 minutos (1h 45 min)

### Fase 2+ (Pospuesto)

- Webhooks de Resend (bounce, complain)
- Rate limiting
- Plantillas complejas (HTML, imágenes)
- Batch sending
- Analytics

---

## 11. Notas de Arquitectura

### Decisiones

1. **Por qué Resend**: servicio único aprobado, simple API, buena DX
2. **Por qué TSX templates**: reutilizar React, composable, type-safe
3. **Por qué async sendEmail()**: retorno asincrónico permite logging, metrics
4. **Sin webhooks en MVP**: captura básica de `messageId` suficiente

### Límites MVP

- ✅ Envío transaccional: confirmación, reset, alertas
- ❌ Reportes PDF: Fase 2
- ❌ Auto-sync: Fase 2
- ❌ Templates complejas: Fase 2
- ❌ Bounce handling: Fase 2

### Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| API key expuesta | Media | Alto | Usar env vars, nunca loguear key |
| Template render error | Baja | Medio | Tests, JSX validation |
| Rate limit excedido | Baja | Medio | Monitoreo en Resend dashboard |
| Email no enviado silenciosamente | Baja | Alto | Logging de response, capture messageId |

---

## 12. Referencias

- [Resend SDK](https://resend.com/docs/send-email)
- [React Email](https://react.email/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Próximo paso**: Una vez aprobada esta spec, proceder a implementación según plan de la sección 10.
