'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2, Eye, Download, Trash2, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';
import { parseSpotifyFile, type ParsedSpotifyFile } from '@/lib/spotify-parser';
import {
  createSpotifyImport,
  updateSpotifyImport,
  getSpotifyImports,
  deleteSpotifyImport,
  createStrategySnapshot,
} from '@/lib/database';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';
import type { SpotifyMetricImport, PodcastStrategySnapshot } from '@/types/database';

type ImportStep = 'upload' | 'validating' | 'preview' | 'importing' | 'done' | 'error';

interface ImportSummary {
  importId: string;
  totalRows: number;
  processedRows: number;
  duplicatesSkipped: number;
  newEpisodesCreated: number;
  episodesUpdated: number;
  periodStart: string | null;
  periodEnd: string | null;
}

export default function SpotifyImportPage() {
  const [step, setStep] = useState<ImportStep>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [parsedFile, setParsedFile] = useState<ParsedSpotifyFile | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [strategy, setStrategy] = useState<PodcastStrategySnapshot | null>(null);
  const [pastImports, setPastImports] = useState<SpotifyMetricImport[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const validTypes = ['.csv', '.xlsx', '.xls', '.json', '.zip'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      toast.error(`Formato no compatible. Acepta: ${validTypes.join(', ')}`);
      return;
    }
    setStep('validating');
    try {
      const result = await parseSpotifyFile(file);
      setParsedFile(result);
      setStep('preview');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al procesar el archivo');
      setStep('error');
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  async function handleImport() {
    if (!parsedFile) return;
    setStep('importing');
    try {
      const authClient = getSupabaseAuthBrowserClient();
      if (!authClient) throw new Error('No autenticado');
      const { data: { session } } = await authClient.auth.getSession();
      if (!session?.user) throw new Error('No autenticado');
      const userId = session.user.id;

      const res = await fetch('/api/spotify/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          importRecord: {
            file_name: parsedFile.fileName,
            file_type: parsedFile.fileType,
            file_size: parsedFile.fileSize,
            file_hash: parsedFile.fileHash,
            uploaded_at: new Date().toISOString(),
            detected_report_type: parsedFile.detectedReportType,
            period_start: parsedFile.periodStart,
            period_end: parsedFile.periodEnd,
            total_rows: parsedFile.totalRows,
          },
          metrics: parsedFile.normalizedMetrics,
        }),
      });

      const data = await res.json();

      if (res.status === 409 && data.duplicate) {
        toast.error('Este archivo ya fue importado antes. Los datos no se duplicarán.');
        setStep('preview');
        return;
      }

      if (!res.ok) throw new Error(data.error || 'Error al importar');

      setImportSummary(data.summary);
      setStep('done');

      // Generar análisis estratégico con IA
      generateStrategyAnalysis(data.summary.importId, parsedFile, userId);

    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al importar');
      setStep('error');
    }
  }

  async function generateStrategyAnalysis(importId: string, file: ParsedSpotifyFile, userId: string) {
    setGeneratingAnalysis(true);
    try {
      const metricsForAI = file.normalizedMetrics
        .filter((m) => m.spotify_episode_title)
        .slice(0, 50)
        .map((m) => ({
          title: m.spotify_episode_title,
          plays: m.plays,
          listeners: m.listeners,
          completionRate: m.completion_rate,
          minutesListened: m.minutes_listened,
          date: m.metric_date,
        }));

      const res = await fetch('/api/ia/analyze-spotify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodStart: file.periodStart || 'desconocido',
          periodEnd: file.periodEnd || 'desconocido',
          totalEpisodes: metricsForAI.length,
          metrics: metricsForAI,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.snapshot) {
          const snapshotWithImport = { ...data.snapshot, import_id: importId };
          const saved = await createStrategySnapshot(snapshotWithImport);
          // Vincular importación con snapshot
          await updateSpotifyImport(importId, { status: 'processed' } as Partial<SpotifyMetricImport>);
          setStrategy(saved);
        }
      }
    } catch {
      // El análisis falla silenciosamente — los datos ya fueron importados
    } finally {
      setGeneratingAnalysis(false);
    }
  }

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const imports = await getSpotifyImports();
      setPastImports(imports);
      setShowHistory(true);
    } catch {
      toast.error('Error al cargar historial');
    } finally {
      setLoadingHistory(false);
    }
  }

  async function handleDeleteImport(id: string) {
    if (!confirm('¿Eliminar esta importación?')) return;
    await deleteSpotifyImport(id);
    setPastImports((prev) => prev.filter((i) => i.id !== id));
    toast.success('Importación eliminada');
  }

  function resetFlow() {
    setStep('upload');
    setParsedFile(null);
    setImportSummary(null);
    setStrategy(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const validationStatus = parsedFile
    ? parsedFile.warnings.length === 0
      ? 'valid'
      : parsedFile.headers.length === 0
        ? 'invalid'
        : 'partial'
    : null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/metricas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Métricas
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0c1f36]">Importar métricas de Spotify</h1>
            <p className="text-sm text-gray-500">Sube archivos exportados desde Spotify for Creators</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadHistory} disabled={loadingHistory}>
          {loadingHistory ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
          <span className="ml-1">Historial</span>
        </Button>
      </div>

      {/* STATE 1: Upload */}
      {step === 'upload' && (
        <Card>
          <CardContent className="pt-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-[#0c1f36] bg-[#0c1f36]/5' : 'border-gray-200 hover:border-[#0c1f36]/40'
              }`}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-[#0c1f36] mb-1">Subir archivo de Spotify</p>
              <p className="text-sm text-gray-500 mb-4">
                Sube aquí los archivos exportados desde Spotify Creators para actualizar el historial de métricas de AMTME.
              </p>
              <div className="flex gap-2 justify-center">
                {['CSV', 'XLSX', 'JSON', 'ZIP'].map((fmt) => (
                  <Badge key={fmt} variant="secondary">{fmt}</Badge>
                ))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json,.zip"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              En Spotify for Creators: Analytics → Exportar datos → Descargar
            </p>
          </CardContent>
        </Card>
      )}

      {/* STATE 2: Validating */}
      {step === 'validating' && (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-[#0c1f36]" />
            <p className="text-sm text-gray-600">Validando archivo y detectando columnas...</p>
          </CardContent>
        </Card>
      )}

      {/* STATE 3: Preview */}
      {step === 'preview' && parsedFile && (
        <div className="space-y-4">
          {/* File info + validation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Información del archivo</CardTitle>
                <Badge variant={
                  validationStatus === 'valid' ? 'default' :
                  validationStatus === 'partial' ? 'secondary' : 'destructive'
                }>
                  {validationStatus === 'valid' ? (
                    <><CheckCircle className="h-3 w-3 mr-1" />Archivo válido</>
                  ) : validationStatus === 'partial' ? (
                    <><AlertCircle className="h-3 w-3 mr-1" />Parcialmente válido</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" />No reconocido</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Archivo</p>
                  <p className="font-medium truncate max-w-[120px]" title={parsedFile.fileName}>{parsedFile.fileName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Formato</p>
                  <p className="font-medium uppercase">{parsedFile.fileType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Filas detectadas</p>
                  <p className="font-medium">{parsedFile.totalRows}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tipo de reporte</p>
                  <p className="font-medium">{parsedFile.detectedReportType.replace(/_/g, ' ')}</p>
                </div>
              </div>

              {(parsedFile.periodStart || parsedFile.periodEnd) && (
                <div className="mt-3 p-3 bg-[#e8ff40]/10 rounded-lg text-sm">
                  <span className="text-gray-500">Periodo detectado: </span>
                  <span className="font-medium">{parsedFile.periodStart} → {parsedFile.periodEnd}</span>
                </div>
              )}

              {parsedFile.warnings.length > 0 && (
                <div className="mt-3 space-y-1">
                  {parsedFile.warnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded p-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {w}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Columnas detectadas ({parsedFile.headers.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {parsedFile.headers.map((h) => (
                    <span key={h} className={`text-xs px-2 py-0.5 rounded ${
                      parsedFile.columnMap[h]
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {h}
                      {parsedFile.columnMap[h] && (
                        <span className="ml-1 opacity-60">→ {parsedFile.columnMap[h]}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview table */}
          {parsedFile.previewRows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Vista previa — primeras {parsedFile.previewRows.length} filas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {parsedFile.headers.slice(0, 8).map((h) => (
                          <th key={h} className="text-left p-2 border border-gray-100 font-medium text-gray-600 max-w-[100px]">
                            {h}
                          </th>
                        ))}
                        {parsedFile.headers.length > 8 && (
                          <th className="p-2 text-gray-400">+{parsedFile.headers.length - 8} más</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedFile.previewRows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {parsedFile.headers.slice(0, 8).map((h) => (
                            <td key={h} className="p-2 border border-gray-100 max-w-[100px] truncate" title={row[h]}>
                              {row[h] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Normalize preview */}
          {parsedFile.normalizedMetrics.slice(0, 3).some((m) => m.spotify_episode_title) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Métricas normalizadas (muestra)</CardTitle>
                <CardDescription>Así quedarán los datos después de importar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {parsedFile.normalizedMetrics.slice(0, 3).filter((m) => m.spotify_episode_title).map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="font-medium text-[#0c1f36] flex-1 mr-4 truncate">{m.spotify_episode_title}</div>
                      <div className="flex gap-4 text-gray-500 text-xs">
                        {m.plays != null && <span>{m.plays} plays</span>}
                        {m.listeners != null && <span>{m.listeners} oyentes</span>}
                        {m.completion_rate != null && <span>{m.completion_rate}% retención</span>}
                        {m.metric_date && <span>{m.metric_date}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={validationStatus === 'invalid'}
              className="bg-[#0c1f36] hover:bg-[#0c1f36]/90 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar y actualizar historial
            </Button>
            <Button variant="outline" onClick={resetFlow}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* STATE 4: Importing */}
      {step === 'importing' && (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-[#0c1f36]" />
            <p className="text-sm font-medium text-[#0c1f36]">Importando métricas...</p>
            <p className="text-xs text-gray-500 mt-1">Normalizando, relacionando episodios y guardando en el historial.</p>
          </CardContent>
        </Card>
      )}

      {/* STATE 5: Done */}
      {step === 'done' && importSummary && (
        <div className="space-y-4">
          {/* Import summary */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Importación completada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-800">{importSummary.processedRows}</p>
                  <p className="text-xs text-green-600">Métricas guardadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-800">{importSummary.newEpisodesCreated}</p>
                  <p className="text-xs text-blue-600">Episodios creados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0c1f36]">{importSummary.episodesUpdated}</p>
                  <p className="text-xs text-gray-600">Episodios actualizados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-500">{importSummary.duplicatesSkipped}</p>
                  <p className="text-xs text-gray-400">Duplicados ignorados</p>
                </div>
              </div>
              {importSummary.periodStart && (
                <div className="mt-3 text-sm text-green-700">
                  Periodo: <strong>{importSummary.periodStart}</strong> → <strong>{importSummary.periodEnd}</strong>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Strategy */}
          {generatingAnalysis ? (
            <Card>
              <CardContent className="pt-6 pb-6 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-[#0c1f36]" />
                <div>
                  <p className="text-sm font-medium">Generando análisis estratégico con IA...</p>
                  <p className="text-xs text-gray-500">Esto puede tomar unos segundos</p>
                </div>
              </CardContent>
            </Card>
          ) : strategy ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#0c1f36]" />
                  Estrategia actualizada por IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#0c1f36]/5 rounded-lg">
                  <p className="text-sm text-[#0c1f36]">{strategy.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {strategy.growth_signals.length > 0 && (
                    <div>
                      <p className="font-medium text-green-700 mb-2">Señales de crecimiento</p>
                      <ul className="space-y-1">
                        {strategy.growth_signals.slice(0, 3).map((s, i) => (
                          <li key={i} className="flex gap-2 text-gray-600">
                            <span className="text-green-500 flex-shrink-0">↑</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {strategy.risk_signals.length > 0 && (
                    <div>
                      <p className="font-medium text-red-700 mb-2">Señales de riesgo</p>
                      <ul className="space-y-1">
                        {strategy.risk_signals.slice(0, 3).map((s, i) => (
                          <li key={i} className="flex gap-2 text-gray-600">
                            <span className="text-red-500 flex-shrink-0">↓</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {strategy.recommended_actions.immediate.length > 0 && (
                  <div>
                    <p className="font-medium text-[#0c1f36] mb-2">Acciones inmediatas</p>
                    <ul className="space-y-1 text-sm">
                      {strategy.recommended_actions.immediate.slice(0, 4).map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[#e8ff40] bg-[#0c1f36] rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 font-bold">{i+1}</span>
                          <span className="text-gray-700">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Link href="/metricas">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Ver dashboard de métricas
                    </Button>
                  </Link>
                  <Link href="/episodios">
                    <Button variant="outline" size="sm">Ver episodios</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Button variant="outline" onClick={resetFlow}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Importar otro archivo
          </Button>
        </div>
      )}

      {/* STATE: Error */}
      {step === 'error' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 pb-6 text-center">
            <XCircle className="h-8 w-8 mx-auto mb-3 text-red-500" />
            <p className="text-sm font-medium text-red-800">Error al procesar el archivo</p>
            <Button variant="outline" className="mt-4" onClick={resetFlow}>
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* History panel */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de importaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {pastImports.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hay importaciones previas</p>
            ) : (
              <div className="space-y-2">
                {pastImports.map((imp) => (
                  <div key={imp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{imp.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {imp.period_start && `${imp.period_start} → ${imp.period_end} · `}
                          {imp.processed_rows ?? imp.total_rows} métricas · {imp.uploaded_at?.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={imp.status === 'processed' ? 'default' : 'secondary'}>
                        {imp.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteImport(imp.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
