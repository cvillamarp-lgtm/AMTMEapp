# AMTME Operating Guide

## Objetivo
Operar AMTME Studio OS como sistema editorial y operativo modular, con control de calidad técnico, seguridad básica y trazabilidad por fase.

## Módulos principales

### Dashboard operativo (`/dashboard`)
- Centro de control operativo.
- Vista general de estado del sistema.
- Acceso rápido a módulos principales.

### Documento maestro (`/documento-maestro`)
- Documento maestro consultable.
- Fuente central de políticas y reglas operativas.

### Gestión de episodios (`/episodios`)
- CRUD de episodios.
- Lista completa de episodios del sistema.

### Workspace por episodio (`/episodios/[episodeId]`)
- Centro operativo por episodio.
- Gestión de datos base, guion, descripción, clips, reels.
- Prompts visuales, assets, checklist.
- Publicación, métricas y auditoría.

### Creador visual (`/creador-visual`)
- Generación de contenido visual por prompt.
- Aplicación de reglas de marca AMTME.
- Validación de composiciones visuales.

### Visual OS
- Librería de reglas visuales y validaciones.
- Paleta de colores, formatos, safe zones, templates.
- Funciones de validación con Zod.

### Automatización controlada (`/automatizacion`)
- Módulo simulation-only con aprobación humana obligatoria.
- Preparación de content packs, checklists, visual briefs.
- Rate limits: 10 tareas/hora, 50 tareas/día.
- Auditoría indefinida de todas las decisiones.

### Métricas (`/metricas`)
- Seguimiento de métricas operativas.
- Análisis de rendimiento.

### Contenido (`/contenido`)
- Gestión de contenido del sistema.

### Configuración (`/configuracion`)
- Configuración general del sistema.
- Variables de entorno y persistencia.

## Reglas operativas
1. Mantener cambios pequeños, auditables y reversibles.
2. No introducir features nuevas durante fases de cierre.
3. No exponer secretos ni claves sensibles en código cliente.
4. Ejecutar validaciones técnicas antes de merge.
5. No cerrar issues maestros hasta completar validación post-merge.
6. Mantener documentación alineada con estado real de `main`.

## Política de alcance
- Permitido en cierre: QA, documentación, validación y estabilización.
- Fuera de alcance: automatizaciones nuevas, APIs externas, cron jobs, Edge Functions, publicación automática y DMs automáticos.
