# REPORTE_UNIFICACION_AMTMEultima_AMTMEapp

## 1) Resumen ejecutivo
AMTMEapp se mantiene como base canónica por estar alineada con Next.js App Router, estructura actual de módulos y validaciones activas del repositorio.

## 2) Alcance y método de auditoría
Se auditó AMTMEapp localmente y se contrastó con el material legacy disponible para identificar piezas reutilizables sin cambiar arquitectura, rutas ni stack principal.

## 3) Estado actual de AMTMEapp (baseline)
- App Router en `src/app`.
- Validaciones existentes: lint, typecheck, test, build y verify.
- Integración Supabase y módulos operativos ya activos en la base.

## 4) Estado de AMTMEultima (legacy) revisado
Se evaluaron utilidades y patrones de bajo riesgo para reutilización incremental. No se toma legacy como base de runtime ni de build.

## 5) Comparación de completitud funcional
AMTMEapp tiene mayor coherencia con la operación actual (routing, módulos y pipeline). Legacy aporta utilidades puntuales reutilizables.

## 6) Decisión canónica y criterios
Se consolida AMTMEapp como único destino canónico. Criterios: compatibilidad con Next.js, riesgo de regresión, mantenibilidad y trazabilidad de cambios.

## 7) Inventario diferencial priorizado
- Migrado en esta iteración: utilidades de texto (`truncateText`, `willTruncate`, `lineClampClass`, `clampFontSize`).
- Pendiente: futuras piezas legacy de riesgo bajo y beneficio claro, siempre por fases.

## 8) Mapa de equivalencias
La equivalencia funcional inicial queda documentada en `docs/MAPA_ARCHIVOS_MIGRADOS.md` con origen, destino y estado de integración.

## 9) Matriz de riesgo por tipo de cambio
- Bajo: utilidades puras y testeables (aplicado en esta entrega).
- Medio: adaptación de componentes con impacto visual.
- Alto: migraciones de arquitectura, build o proveedores (descartadas en esta fase).

## 10) Plan por fases y checklist técnico
1. Auditoría y baseline.
2. Migraciones utilitarias incrementales con pruebas.
3. Integración en vistas objetivo sin alterar arquitectura.
4. Validación completa y revisión de seguridad.
