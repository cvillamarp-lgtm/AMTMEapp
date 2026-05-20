# AMTME Testing

## Comandos oficiales

```bash
npm install
npm run lint
npm run type-check
npm run test
npm run build
npm run format:check
npm run verify
```

## Cobertura funcional validada
- Calidad estática: ESLint + TypeScript.
- Pruebas unitarias/integración con Vitest.
- Build de Next.js para verificación de compilación.
- Verificación agregada con `npm run verify`.

## Alcance mínimo de QA por fase de cierre
1. Confirmar que `main` compila y testea en local.
2. Confirmar que CI en GitHub Actions está en verde.
3. Confirmar que no hay cambios funcionales no autorizados.
4. Confirmar que la documentación refleja el estado real.

## Criterio PASS
Una validación se considera PASS únicamente cuando cada comando termina con exit code `0` y sin fallas bloqueantes.
