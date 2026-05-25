import type { AiEditorScope, AiChangePlan, RiskLevel } from './types';

// ── Mapa de rutas reales del proyecto ─────────────────────────────────────

const ROUTE_FILE_MAP: Record<string, string[]> = {
  '/dashboard': ['src/app/dashboard/page.tsx'],
  '/ia': ['src/app/ia/page.tsx'],
  '/ia/editor': ['src/app/ia/editor/page.tsx'],
  '/episodios': ['src/app/episodios/page.tsx'],
  '/creador-visual': ['src/app/creador-visual/page.tsx'],
  '/contenido': ['src/app/contenido/page.tsx'],
  '/calendario': ['src/app/calendario/page.tsx'],
  '/metricas': ['src/app/metricas/page.tsx'],
  '/monetizacion': ['src/app/monetizacion/page.tsx'],
  '/automatizacion': ['src/app/automatizacion/page.tsx'],
  '/configuracion': ['src/app/configuracion/page.tsx'],
  '/verificador': ['src/app/verificador/page.tsx'],
  '/historico': ['src/app/historico/page.tsx'],
  '/checklists': ['src/app/checklists/page.tsx'],
  '/politica-operativa': ['src/app/politica-operativa/page.tsx'],
  '/documento-maestro': ['src/app/documento-maestro/page.tsx'],
};

const SCOPE_FILE_MAP: Record<AiEditorScope, string[]> = {
  current_page: [],
  module: [],
  whole_app: [
    'src/app/layout.tsx',
    'src/components/studio-shell.tsx',
    'src/components/studio-provider.tsx',
    'src/components/ui.tsx',
  ],
  styles_only: ['src/app/globals.css', 'tailwind.config.ts'],
  copy_only: ['src/lib/studio-data.ts'],
  data_only: ['src/lib/studio-types.ts', 'src/lib/studio-data.ts'],
  components_only: [
    'src/components/studio-shell.tsx',
    'src/components/studio-provider.tsx',
    'src/components/ui.tsx',
  ],
};

// ── Extrae palabras clave de ruta de una instrucción ───────────────────────

function extractRouteHints(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const hints: string[] = [];

  const routeKeywords: Record<string, string> = {
    configuración: '/configuracion',
    configuracion: '/configuracion',
    dashboard: '/dashboard',
    episodio: '/episodios',
    episodios: '/episodios',
    'creador visual': '/creador-visual',
    contenido: '/contenido',
    calendario: '/calendario',
    métricas: '/metricas',
    metricas: '/metricas',
    monetización: '/monetizacion',
    monetizacion: '/monetizacion',
    automatización: '/automatizacion',
    automatizacion: '/automatizacion',
    verificador: '/verificador',
    histórico: '/historico',
    historico: '/historico',
    checklists: '/checklists',
    política: '/politica-operativa',
    politica: '/politica-operativa',
    'documento maestro': '/documento-maestro',
    ia: '/ia',
    'editor ia': '/ia/editor',
  };

  for (const [keyword, route] of Object.entries(routeKeywords)) {
    if (lower.includes(keyword)) {
      hints.push(route);
    }
  }

  return [...new Set(hints)];
}

// ── Resuelve archivos afectados a partir de la instrucción y alcance ───────

export function resolveAffectedFiles(
  prompt: string,
  scope: AiEditorScope
): { files: string[]; routes: string[] } {
  const routeHints = extractRouteHints(prompt);
  const routeFiles = routeHints.flatMap((r) => ROUTE_FILE_MAP[r] ?? []);
  const scopeFiles = SCOPE_FILE_MAP[scope] ?? [];

  const allFiles = [...new Set([...routeFiles, ...scopeFiles])];
  const routes = routeHints.length > 0 ? routeHints : Object.keys(ROUTE_FILE_MAP).slice(0, 3);

  return {
    files: allFiles.length > 0 ? allFiles : ['src/app/layout.tsx'],
    routes,
  };
}

// ── Determina el nivel de riesgo ───────────────────────────────────────────

export function assessRisk(
  files: string[],
  mode: AiChangePlan['riskLevel'] | undefined,
  prompt: string
): RiskLevel {
  const lower = prompt.toLowerCase();

  if (
    lower.includes('eliminar') ||
    lower.includes('borrar') ||
    lower.includes('remover ruta') ||
    lower.includes('producción')
  ) {
    return 'critical';
  }

  if (
    files.some((f) => f.includes('layout') || f.includes('globals.css') || f.includes('tailwind'))
  ) {
    return 'high';
  }

  if (files.some((f) => f.includes('studio-shell') || f.includes('studio-provider'))) {
    return 'medium';
  }

  if (files.length <= 2) {
    return 'low';
  }

  return 'medium';
}
