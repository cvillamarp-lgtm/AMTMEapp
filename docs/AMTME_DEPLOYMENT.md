# AMTME Deployment

## Requisitos
- Variables de entorno definidas para IA y Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` solo en servidor.
- `NEXT_PUBLIC_*` reservado para variables públicas.
- Migraciones de Supabase aplicadas según necesidad del entorno.

## Validación previa a deploy
Ejecutar obligatoriamente:

```bash
npm install
npm run lint
npm run type-check
npm run test
npm run build
npm run format:check
npm run verify
```

Además:
- Verificar CI en verde para el PR y para `main` post-merge.
- Confirmar que no hay secretos versionados.
- Confirmar que no hay cambios funcionales fuera de alcance.

## Restricciones operativas
- No desplegar cambios de features nuevas en fase de cierre.
- No incluir automatización nueva, cron jobs ni Edge Functions.
- No integrar APIs externas nuevas durante cierre integral.
- No cerrar Issue #5 antes de completar validación post-merge.

## Referencia
Para detalles de configuración Vercel + Supabase, revisar `docs/DEPLOYMENT.md`.
