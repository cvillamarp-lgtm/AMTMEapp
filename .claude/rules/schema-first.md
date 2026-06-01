---
paths:
  - "src/lib/database.ts"
  - "src/types/database.ts"
  - "supabase/**"
---

- Todas las tablas usan `payload jsonb` — nunca columnas directas para campos de negocio.
- Query pública siempre con `.is('user_id', null)` — nunca `.eq('owner_id', ...)`.
- `updateOne` debe hacer merge del payload existente antes de escribir — nunca reemplazar payload completo.
- Tabla `scripts` fue creada via SQL manual en Supabase — no existe en migrations iniciales.
- No agregar columnas directas a tablas existentes sin migration explícita.
