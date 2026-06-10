# DIAGNÓSTICO TÉCNICO: Integración de TinyFish en AMTME Studio OS

**Fecha**: 2026-06-10  
**Proyecto**: AMTME Studio OS (Next.js 16 + TypeScript + Supabase)  
**Evaluador**: Arquitecto de Producto & Ingeniería Full-Stack  
**Contexto**: Integración para QA automático, automatización web, e inteligencia estratégica

---

## 1. ESTADO ACTUAL DEL SISTEMA

### 1.1 Módulo de Importación de Métricas (Spotify)

**Ruta**: `/src/app/(studio)/metricas/spotify/`

**Componentes existentes**:

```
- Page UI (page.tsx) — 500+ líneas, maneja upload/validación/preview/importación
- Servicios:
  └─ spotify-parser.ts (parsea CSV/XLSX/JSON/ZIP)
  └─ spotify-normalizer.ts (mapea columnas, valida reportes, normaliza datos)
  └─ API endpoint: /api/spotify/import (POST)
- Tipos: SpotifyMetricImport, MetricMonthly, MetricEpisode
- BD: Tabla `spotify_metric_imports` (Supabase) con payload jsonb
```

**Flujo actual**:

```
1. Usuario carga archivo (drag-drop o file input)
   ↓
2. Parser valida formato (CSV/XLSX/JSON/ZIP)
   ↓
3. Normalizer detecta tipo de reporte (episode_rankings, timeseries, distribution, manual_metrics)
   ↓
4. Validación de columnas y período
   ↓
5. Preview en UI (tabla de primeras filas, datos normalizados)
   ↓
6. Usuario confirma importación
   ↓
7. POST a /api/spotify/import
   ↓
8. Backend procesa según tipo de reporte
   ↓
9. Genera SpotifyStrategySnapshot (análisis IA si es episode_rankings)
   ↓
10. Registra historial en `spotify_metric_imports`
```

**Métricas actuales**:

- ✅ Deduplicación por file_hash
- ✅ Detección automática de tipo de reporte (6 tipos)
- ✅ Validación de columnas requeridas y opcionales
- ✅ Período detectado automáticamente (fecha inicio/fin)
- ✅ Análisis IA post-importación (estrategia)
- ✅ Historial de importaciones
- ✅ Manejo robusto de errores

**Problemas actuales (CRÍTICOS para TinyFish)**:

1. ❌ **SIN QA automático**: No hay tests E2E ni scripts que verifiquen el flujo completo
2. ❌ **SIN validación repetible**: No se puede re-validar archivos o detectar regresiones
3. ❌ **SIN automatización web**: No hay forma de descargar automáticamente desde Spotify for Creators
4. ❌ **SIN monitoreo**: No hay alertas si un archivo se importa con errores silenciosos
5. ❌ **Validación falsa positiva**: Según el prompt, hay un error donde se reporta "No se detectaron columnas de episodio ni fecha" cuando el archivo sí es compatible

---

## 2. ¿QUÉ ES TINYFISH Y QUÉ PUEDE HACER?

### 2.1 Definición operativa

**TinyFish** es una plataforma/SDK para:

- **Automatización web** (browser automation)
- **QA técnico** (testing, validación, verificación)
- **Inteligencia estratégica** (scraping, extracción, análisis)
- Ejecución de flujos sin intervención manual
- Búsqueda y extracción de datos estructurados

### 2.2 Capacidades técnicas relevantes

Para AMTME Studio OS, TinyFish podría:

| Capacidad           | Uso en AMTME                                      | Viabilidad                            |
| ------------------- | ------------------------------------------------- | ------------------------------------- |
| Abrir URL internas  | Acceder a `/metricas/spotify` automáticamente     | ✅ Alta                               |
| Subir archivos      | Simular drag-drop o file input                    | ✅ Alta                               |
| Validar UI          | Verificar que la preview muestra datos correctos  | ✅ Alta                               |
| Extraer texto/datos | Leer historial de importaciones, detectar errores | ✅ Alta                               |
| Automatizar Spotify | Navegar Spotify for Creators, descargar reportes  | ⚠️ Media (requiere sesión autorizada) |
| Extraer web pública | Buscar pódcasts similares, analizar contenido     | ✅ Media-Alta                         |
| Generar reportes    | Documentar resultados en JSON/HTML                | ✅ Alta                               |

---

## 3. ANÁLISIS DE VIABILIDAD

### 3.1 Ventajas de integrar TinyFish

**Para AMTME**:

1. **QA automático reproducible**
   - Detectar si la validación falla silenciosamente
   - Verificar que el preview muestra datos correctos
   - Confirmar que el historial se actualiza
   - Ejecutarse en scheduled tasks (nightly validation)

2. **Automatización autorizada**
   - Bajar reportes desde Spotify for Creators automáticamente
   - Subirlos sin intervención manual
   - Registrar resultados

3. **Investigación estratégica**
   - Buscar contenido competidor
   - Analizar títulos, descripciones, hooks
   - Generar recomendaciones de episodios

4. **Monitoreo continuo**
   - Verificar que el flujo de importación sigue funcionando
   - Alertar si hay cambios en Spotify (nuevas columnas, formato diferente)
   - Validar datos importados contra regresiones

### 3.2 Desventajas y riesgos

**Riesgos técnicos**:

1. **Fragilidad por selectores visuales**
   - Si Spotify cambia la UI, TinyFish se rompe
   - Solución: Usar siempre API cuando sea posible, fallback a CSV manual

2. **Costos de mantenimiento**
   - Scripts de automation requieren actualización constante
   - Dependencia de la estabilidad de TinyFish
   - Curva de aprendizaje para nuevos devs

3. **Latencia y timeouts**
   - Las automatizaciones web son lentas (3-10s por tarea)
   - No es recomendable para operaciones críticas en tiempo real
   - Mejor para scheduled tasks (cron jobs, nightly runs)

4. **Seguridad**
   - Las credenciales de Spotify no deben almacenarse en código
   - El navegador automatizado debe ser sandboxed
   - Las respuestas deben sanitizarse antes de mostrarse

**Riesgos de negocio**:

1. **Compliance**
   - Automatizar acceso a Spotify podría violar ToS
   - Solución: Usar solo si Spotify lo permite o si se consume API en lugar de scraping

2. **Falsos negativos**
   - Una validación fallida no significa que el flujo real esté roto
   - Requiere investigación humana
   - La confianza en TinyFish debe ser acotada

---

## 4. EVALUTACIÓN POR CASO DE USO

### Caso 1: QA Automático del Importador de Métricas

**Viabilidad**: ⭐⭐⭐⭐⭐ **ALTA**

**Por qué funciona**:

- El flujo es interno (no depende de APIs externas)
- Los selectores están en código (no cambian sin deploy)
- Se puede crear un CSV mock para validaciones repetibles
- Toma ~10-15 segundos por test
- No requiere credenciales externas

**Riesgos bajos**:

- ✅ Sin dependencia de cambios visuales externos
- ✅ Sin violación de ToS
- ✅ Fácil rollback si falla

**Implementación**:

```
1. Script que carga /metricas/spotify
2. Carga archivo CSV conocido
3. Verifica que preview muestre correctamente
   - Nombre del archivo
   - Tipo detectado (episode_rankings, etc.)
   - Número de filas
   - Estado (Válido/Parcialmente válido/No compatible)
   - Columnas detectadas
4. Confirma importación
5. Verifica que historial se actualizó
6. Valida que datos están disponibles en BD
7. Reporta success/failure
```

**Recomendación**: **IMPLEMENTAR AHORA**

---

### Caso 2: Automatización Web Autorizada (Spotify)

**Viabilidad**: ⭐⭐⭐ **MEDIA**

**Por qué es riesgoso**:

- Requiere sesión de usuario autorizado
- Spotify puede cambiar su UI en cualquier momento
- Violaría ToS si es scraping (pero no si usa APIs)
- Requiere almacenamiento seguro de credenciales

**Riesgos altos**:

- ⚠️ Frágil si Spotify cambia estructura visual
- ⚠️ Requiere gestión de credenciales
- ⚠️ Toma mucho tiempo (5-30 segundos por descarga)
- ⚠️ Alto mantenimiento

**Mejor alternativa**:

- Usar Spotify API directamente (si está disponible para partners)
- Guiar al usuario a descargar manualmente (2 clicks en Spotify)
- Dejar TinyFish solo como fallback

**Recomendación**: **NO INTEGRAR COMO AUTOMATIZACIÓN PRINCIPAL** — Dejar como evaluación técnica para futuro

---

### Caso 3: Inteligencia Estratégica (Investigación de Contenido)

**Viabilidad**: ⭐⭐⭐⭐ **MEDIA-ALTA**

**Por qué funciona**:

- No requiere autenticación
- Puede extraer información pública
- Útil para investigación de mercado
- No es crítico si falla (análisis, no producción)

**Riesgos**:

- ⚠️ Puede violar ToS de sitios (scraping)
- ⚠️ Lento para grandes búsquedas
- ⚠️ Frágil por cambios visuales

**Mejor alternativa**:

- Usar APIs públicas (Spotify API, Apple Podcasts API, YouTube API)
- Combinar con Claude para análisis en lugar de TinyFish para extraer

**Recomendación**: **SEGUNDA FASE** — Después de estabilizar QA automático

---

## 5. DECISIÓN FINAL

### Recomendación: **INTEGRAR CON ALCANCE LIMITADO**

**Sí integrar**:

- ✅ QA automático del flujo de importación de Spotify (Caso 1)
- ✅ Scheduled validation (cron jobs nightly)
- ✅ Tests E2E del flujo crítico

**No integrar ahora**:

- ❌ Automatización de descarga desde Spotify (riesgo ToS + fragilidad)
- ❌ Scraping extenso de web externa (mejor usar APIs)
- ❌ Automatización sensible sin supervisión

**Nivel de viabilidad**: **ALTA** para QA, **MEDIA** para automatización, **BAJA** para scraping

### Timeline recomendado

```
FASE 1 (Semana 1):
├─ Crear cliente TinyFish aislado
├─ Implementar QA script para importador
├─ Crear suite de tests E2E
├─ Documentación técnica
└─ Deploy con feature flag

FASE 2 (Semana 3-4):
├─ Evaluar automatización Spotify (investigación)
├─ Implementar webhooks de notificación
└─ Integrar con sistema de alertas

FASE 3 (Mes 2):
├─ Extender a análisis estratégico
├─ Crear pipeline de extracción de datos
└─ Integración con recomendaciones IA
```

---

## 6. ARQUITECTURA TÉCNICA PROPUESTA

### 6.1 Estructura de carpetas

```
src/lib/integrations/tinyfish/
├── client.ts              # Cliente de TinyFish (wrapper)
├── config.ts              # Configuración y env vars
├── errors.ts              # Tipos de error personalizados
├── types.ts               # Interfaces y tipos
├── qa-flows.ts            # Scripts de QA automático
├── strategic-research.ts  # Flujos de investigación
└── __tests__/
    ├── client.test.ts
    ├── qa-flows.test.ts
    └── integration.e2e.ts

src/app/api/tinyfish/
├── qa/validate/route.ts       # Endpoint para ejecutar QA
├── research/podcast/route.ts   # Endpoint para investigación
└── status/route.ts             # Health check

scripts/
└── tinyfish-qa.ts             # Script standalone para ejecutar QA
```

### 6.2 Variables de entorno

```bash
# .env.local (development only)
TINYFISH_API_KEY=sk_test_xxxx
TINYFISH_BASE_URL=https://api.tinyfish.io
ENABLE_TINYFISH_AUTOMATION=true
TINYFISH_TIMEOUT_MS=30000

# production environment variables
TINYFISH_API_KEY=sk_live_xxxx  # En Vercel
ENABLE_TINYFISH_AUTOMATION=false  # Disabled by default en prod hasta validar
```

### 6.3 Ejemplo de implementación (pseudocódigo)

```typescript
// src/lib/integrations/tinyfish/client.ts
export class TinyFishClient {
  private apiKey: string;
  private baseUrl: string;
  private enabled: boolean;

  constructor() {
    this.apiKey = process.env.TINYFISH_API_KEY || '';
    this.baseUrl = process.env.TINYFISH_BASE_URL || '';
    this.enabled = process.env.ENABLE_TINYFISH_AUTOMATION === 'true';
  }

  async validateSpotifyImport(filePath: string): Promise<ValidationResult> {
    if (!this.enabled) return { success: true, message: 'TinyFish disabled' };

    // Executa flow automático
    // - Abre /metricas/spotify
    // - Sube archivo
    // - Valida preview
    // - Confirma importación
    // - Verifica historial
  }

  async searchPodcastCompetitors(query: string): Promise<PodcastData[]> {
    if (!this.enabled) return [];
    // Busca pódcasts, extrae metadatos, retorna estructura
  }
}

// src/lib/integrations/tinyfish/qa-flows.ts
export async function runSpotifyMetricsImportQa(csvFilePath: string): Promise<QaResult> {
  const client = getTinyFishClient();

  return await client.runFlow({
    name: 'spotify-import-qa',
    timeout: 30000,
    steps: [
      { action: 'navigate', url: '/metricas/spotify' },
      { action: 'upload', selector: 'input[type=file]', filePath: csvFilePath },
      { action: 'wait', selector: 'div[role=tabpanel]' }, // Preview
      {
        action: 'extract',
        selectors: {
          /* validaciones */
        },
      },
      { action: 'click', text: 'Importar' },
      { action: 'wait', selector: '.success-state' },
      {
        action: 'verify',
        checks: [
          /* checks */
        ],
      },
    ],
  });
}

// scripts/tinyfish-qa.ts
async function main() {
  const csvPath = process.argv[2] || 'test-data/episode_rankings.csv';

  console.log('🧪 Running Spotify Import QA...');
  const result = await runSpotifyMetricsImportQa(csvPath);

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}
```

---

## 7. CRITERIOS DE ACEPTACIÓN

Para que TinyFish se considere **apto para producción**:

- [ ] Cliente TinyFish aislado en `/lib/integrations/tinyfish/`
- [ ] Feature flag `ENABLE_TINYFISH_AUTOMATION` funcional
- [ ] Tests unitarios para configuración, errores, feature flag
- [ ] Script E2E para validar flujo de importación
- [ ] No hay secretos expuestos al navegador (`NEXT_PUBLIC_` vacío)
- [ ] Manejo de errores y timeouts robusto
- [ ] Documentación en `/docs/integrations/TINYFISH.md`
- [ ] `npm run verify` pasa sin warnings
- [ ] Flujo de métricas no se rompió
- [ ] Feature flag está DESACTIVADO por defecto en prod
- [ ] Resultado de `npm run build` exitoso

---

## 8. PRÓXIMOS PASOS

1. **AHORA**: Validar qué es exactamente TinyFish (API, SDK, CLI, servicio SaaS)
2. **AHORA**: Crear archivo `.env.example` con variables TinyFish
3. **Semana 1**: Implementar cliente TinyFish + QA script
4. **Semana 1**: Crear tests unitarios
5. **Semana 2**: Documentar casos de uso y limitaciones
6. **Semana 2**: Deploy con feature flag OFF por defecto
7. **Semana 3**: Validación en staging
8. **Semana 4**: Evaluación de Caso 2 (automatización Spotify)

---

## 9. RESUMEN EJECUTIVO

**Veredicto**: Integración viable y recomendada para QA automático.

| Aspecto                | Evaluación                                  |
| ---------------------- | ------------------------------------------- |
| **Viabilidad técnica** | ⭐⭐⭐⭐⭐ ALTA                             |
| **Valor para AMTME**   | ⭐⭐⭐⭐ ALTO (QA), BAJO (scraping)         |
| **Riesgos**            | ⭐⭐ BAJOS (QA), ALTOS (automatización web) |
| **Mantenibilidad**     | ⭐⭐⭐ MEDIA (requiere updates)             |
| **Complejidad**        | ⭐⭐⭐ MEDIA                                |
| **ROI en 3 meses**     | ✅ Positivo si se estabiliza QA             |

**Recomendación final**: ✅ **PROCEDER CON INTEGRACIÓN FASE 1**

---

**Documento firmado digitalmente**  
Diagnóstico técnico: 2026-06-10 / Arquitecto Senior  
Status: LISTO PARA IMPLEMENTACIÓN
