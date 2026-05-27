# DECISIONES_CANONICAS_UNIFICACION

1. **Base canónica**: AMTMEapp se mantiene como única base activa.
2. **Arquitectura**: se preserva Next.js App Router; no se migra a Vite/Spark.
3. **Integración incremental**: solo piezas legacy de bajo riesgo y alto valor.
4. **Sin cambios de plataforma**: no se alteran rutas base, Supabase ni pipeline principal.
5. **Validación obligatoria**: cada iteración debe cerrar con lint, typecheck, tests, build y verify.
6. **Trazabilidad**: toda migración debe quedar documentada en mapa de archivos y descarte explícito.
