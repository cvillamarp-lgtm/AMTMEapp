export type SearchResultCategory =
  | 'episodios'
  | 'contenido'
  | 'activos-visuales'
  | 'checklists'
  | 'calendario'
  | 'metricas'
  | 'monetizacion'
  | 'automatizacion'
  | 'archivo'
  | 'documento-maestro'
  | 'ia'
  | 'siguiente-accion';

export type SearchResultPriority = 'high' | 'medium' | 'low';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: SearchResultCategory;
  href: string;
  source: 'studio-state' | 'computed';
  priority: SearchResultPriority;
  keywords: string[];
  status?: string;
}
