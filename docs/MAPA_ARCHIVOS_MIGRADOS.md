# MAPA_ARCHIVOS_MIGRADOS

## Migraciones materializadas en esta rama

| Tipo | Destino AMTMEapp | Estado | Nota |
|---|---|---|---|
| Utilidad | `src/lib/text-utils.ts` | Migrado | Funciones de truncado/normalización y helpers de presentación |
| Tests | `src/lib/text-utils.test.ts` | Migrado | Cobertura mínima de contratos funcionales |
| Integración UI | `src/app/dashboard/page.tsx` | Integrado | Uso de `truncateText` en alertas y títulos de episodios |

## Equivalencias funcionales
- Truncado y normalización de texto -> `truncateText`.
- Validación de necesidad de truncado -> `willTruncate`.
- Clase utilitaria line clamp -> `lineClampClass`.
- Clamp numérico para tamaño de fuente -> `clampFontSize`.
