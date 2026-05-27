# LEGACY_DESCARTADO

## Criterios de descarte en esta fase
- Cambios que impliquen migrar arquitectura a Vite/Spark.
- Código duplicado respecto de módulos ya estables en AMTMEapp.
- Piezas con riesgo alto de romper rutas, build o flujo App Router.
- Integraciones que toquen secretos o configuración sensible.
- Cambios no cubiertos por pruebas mínimas o sin validación reproducible.

## Resultado de esta iteración
Se descartó cualquier migración estructural y se aplicó únicamente la migración utilitaria de texto en `src/lib/text-utils.ts` con pruebas dedicadas.
