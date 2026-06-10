# TinyFish Integration Guide

**Status**: Implementado (Fase 1: QA Automático)  
**Last Updated**: 2026-06-10  
**Author**: Architecture Team

---

## 1. Descripción General

TinyFish es una plataforma de automatización web integrada en AMTME Studio OS para:

- **QA Automático**: Validación reproducible de flujos críticos
- **Automatización Web**: Ejecución de tareas repetibles sin intervención humana
- **Inteligencia Estratégica**: Extracción y análisis de información

### 1.1 Estado Actual (Fase 1)

✅ **Implementado**:

- Cliente TinyFish aislado
- QA automático para importador de métricas de Spotify
- Feature flag funcional
- Tests unitarios
- Documentación técnica

⏳ **Planeado**:

- Fase 2: Automatización de descarga desde Spotify (Semana 3-4)
- Fase 3: Investigación estratégica de contenido (Mes 2)

---

## 2. Configuración

### 2.1 Variables de Entorno

```bash
# Habilitación de TinyFish (default: false)
ENABLE_TINYFISH_AUTOMATION=false

# Credenciales (requeridas si ENABLE_TINYFISH_AUTOMATION=true)
TINYFISH_API_KEY=sk_test_xxxx
TINYFISH_BASE_URL=https://api.tinyfish.io

# Timeouts y configuración
TINYFISH_TIMEOUT_MS=30000
TINYFISH_TEST_CSV=test-data/episode_rankings.csv
```

### 2.2 Inicialización

TinyFish se inicializa automáticamente en server-side:

```typescript
import { getTinyFishClient } from '@/lib/integrations/tinyfish/client';

const client = getTinyFishClient();
if (client.isEnabled()) {
  // TinyFish está habilitado y configurado
}
```

---

## 3. Casos de Uso Aprobados

### ✅ Caso 1: QA Automático del Importador de Métricas

**Ruta**: `/metricas/spotify`

**Flujo Validado**:

1. Navegar a `/metricas/spotify`
2. Cargar archivo CSV
3. Validar que la preview se genera correctamente
4. Confirmar importación
5. Verificar historial actualizado
6. Confirmar datos en BD

**Ejecución**:

```typescript
import { runSpotifyMetricsImportQA } from '@/lib/integrations/tinyfish/qa-flows';

const result = await runSpotifyMetricsImportQA('path/to/test.csv');

if (result.passed) {
  console.log('✅ Importación de métricas funcionando correctamente');
} else {
  console.error('❌ Falla en QA:', result.validation.errors);
}
```

**Cuándo ejecutar**:

- Cron job nightly para validación continua
- Pre-deployment como smoke test
- Cambios en el importador de métricas

**Costo**: ~10-15 segundos por ejecución

---

## 4. Casos de Uso NO Aprobados

### ❌ Scraping de Spotify for Creators

**Riesgo**: Viola ToS de Spotify  
**Solución**: Descargar manualmente o usar API oficial si está disponible

### ❌ Scraping Extenso de Web Externa

**Riesgo**: Frágil, mantenimiento alto  
**Solución**: Usar APIs públicas o herramientas especializadas

### ❌ Automatización Sensible sin Supervisión

**Riesgo**: Alteración de datos críticos sin confirmación  
**Solución**: Siempre requerir aprobación humana antes de actuar

---

## 5. Guía de Uso

### 5.1 Ejecución Manual de QA

```bash
# Ejecutar validación de Spotify (mock si TinyFish está deshabilitado)
npm run tinyfish:qa:spotify

# Ver status de TinyFish
npm run tinyfish:status
```

### 5.2 Integración en Tests

```typescript
import { runSpotifyMetricsImportQA } from '@/lib/integrations/tinyfish/qa-flows';

describe('Spotify Metrics Import QA', () => {
  it('should validate complete import workflow', async () => {
    const result = await runSpotifyMetricsImportQA('test-data/episode_rankings.csv');

    expect(result.passed).toBe(true);
    expect(result.validation.uploadSuccess).toBe(true);
    expect(result.validation.importSuccess).toBe(true);
  });
});
```

### 5.3 Integración en Cron Jobs

```typescript
// api/cron/validate-metrics.ts
import { validateAllCriticalFlows } from '@/lib/integrations/tinyfish/qa-flows';

export async function GET(request: Request) {
  // Verificar auth token
  const token = request.headers.get('authorization');
  if (token !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await validateAllCriticalFlows();

  if (!result.allPassed) {
    // Alertar al equipo
    await notifyTeam('TinyFish validation failed', result.errors);
  }

  return Response.json(result);
}
```

---

## 6. Interpretación de Resultados

### 6.1 QA Result Success

```json
{
  "qaResult": {
    "status": "success",
    "flowName": "spotify-metrics-import-qa",
    "durationMs": 5432,
    "steps": [
      {
        "name": "Navigate to /metricas/spotify",
        "action": "navigate",
        "status": "success",
        "durationMs": 245
      }
      // ... más steps
    ]
  },
  "validation": {
    "uploadSuccess": true,
    "previewCorrect": true,
    "validationStatus": "valid",
    "importSuccess": true,
    "historyUpdated": true,
    "errors": []
  },
  "passed": true
}
```

### 6.2 QA Result Failure

Si `passed: false`, revisar:

1. **`validation.errors`** — Errores específicos encontrados
2. **Failed steps** — Qué paso fallé exactamente
3. **Step details** — Información del error en ese paso

**Acciones**:

- Revisar logs en Supabase
- Verificar que el importador de métricas no está roto
- Si es un false positive, reportar a architecture@

---

## 7. Seguridad

### 7.1 Reglas de Seguridad

✅ **Permitido**:

- Ejecutar flows solo server-side
- Almacenar API keys en `process.env` solamente
- Validar datos antes de mostrar en UI

❌ **Prohibido**:

- Exponer credenciales con `NEXT_PUBLIC_`
- Guardar tokens de sesión en código
- Ejecutar acciones destructivas sin confirmación

### 7.2 Sanitización de Datos

Todo dato extraído por TinyFish debe ser sanitizado antes de mostrarlo:

```typescript
// ❌ MALO
const extracted = await client.extractData(selector);
renderHTML(extracted); // XSS Risk!

// ✅ BUENO
import { sanitize } from '@/lib/security/sanitize';
const extracted = await client.extractData(selector);
renderHTML(sanitize(extracted));
```

---

## 8. Monitoreo y Alertas

### 8.1 Métricas a Observar

- ⏱️ Duración de flows (target: < 15s)
- ✅ Tasa de éxito de validaciones (target: 100%)
- 🔄 Timeouts (target: 0)

### 8.2 Alertas Automáticas

Configura alertas para:

- Flow duration > 30s
- Step failure rate > 5%
- Configuration errors

---

## 9. Solución de Problemas

### 9.1 "TinyFish automation is disabled"

**Causa**: `ENABLE_TINYFISH_AUTOMATION ≠ 'true'`

**Solución**:

- En desarrollo: activa en `.env.local`
- En producción: usa feature flag en Vercel con `ENABLE_TINYFISH_AUTOMATION=true`

### 9.2 "TINYFISH_API_KEY is not configured"

**Causa**: API key faltante cuando TinyFish está habilitado

**Solución**:

- Verificar que `TINYFISH_API_KEY` está en `.env.local` o Vercel
- Asegurar que el valor no está vacío

### 9.3 Flow times out

**Causa**: Página tarda más del timeout (30s por defecto)

**Solución**:

- Aumentar `TINYFISH_TIMEOUT_MS`
- Reducir complejidad del flow
- Verificar que la página no está bloqueada

### 9.4 Step fails silently

**Causa**: Selector no encontrado o acción no completada

**Solución**:

- Revisar que el selector en `qa-flows.ts` coincide con el DOM actual
- Ejecutar manualmente para validar
- Actualizar selector si cambió la UI

---

## 10. Limiting Conocidos

⚠️ **Fragilidad visual**: Si Spotify o la UI de AMTME cambian, los selectores pueden romperse

⚠️ **Latencia**: Automatización web es lenta (3-10s por acción)

⚠️ **Coverage parcial**: QA automático valida happy path, no edge cases

⚠️ **ToS compliance**: No usar para scraping o automatización no autorizada

---

## 11. Roadmap

**Semana 1**: ✅ QA automático básico (COMPLETADO)

**Semana 3-4**: Fase 2 - Automatización autorizada

- Evaluar descarga desde Spotify for Creators
- Implementar si API está disponible
- Fallback a manual CSV si no

**Mes 2**: Fase 3 - Investigación estratégica

- Búsqueda de pódcasts competidores
- Extracción de metadatos
- Análisis de patrones de contenido

---

## 12. Contacto y Soporte

Preguntas sobre TinyFish:

- 📧 architecture@amtme.com
- 📍 Issues en repo: `[tinyfish]` prefix
- 📚 Ver `/docs/integrations/TINYFISH.md` (este archivo)

---

**Documento controlado por Architecture Team**  
Próxima revisión: 2026-07-10
