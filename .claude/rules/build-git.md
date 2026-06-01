---
paths:
  - ".git/**"
  - "package.json"
---

- Build: `npx next build` — NUNCA `npm run build` (cuelga por pre-commit type-check).
- Type check separado: `npx tsc --noEmit`.
- Git bloqueado: `pkill -9 git && sleep 2 && rm -f .git/index.lock` antes de reintentar.
- Commit sin hooks: `git commit --no-verify -m "mensaje"`.
- Archivos `index 2..5` en `.git/` son residuos — no tocar ni borrar.
- Escritura con `!` u otros caracteres especiales shell: usar Python3 heredoc, no zsh EOF.
  ```bash
  python3 << 'PYEOF'
  with open("path/file", "w") as f: f.write("""contenido""")
  PYEOF
  ```
