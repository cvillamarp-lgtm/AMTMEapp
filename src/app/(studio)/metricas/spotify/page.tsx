'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, UploadSimple, CheckCircle, XCircle, X, FileText } from '@phosphor-icons/react';
import { parseSpotifyFile } from '@/lib/spotify-parser';
import type { SpotifyParseResult } from '@/lib/spotify-parser';

const ACCEPTED = '.csv,.xlsx,.json,.zip';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  result: SpotifyParseResult | null;
  processing: boolean;
}

export default function MetricasSpotifyPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback(async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const entries: UploadedFile[] = arr.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      result: null,
      processing: true,
    }));

    setFiles((prev) => [...prev, ...entries]);

    const results = await Promise.all(arr.map((f) => parseSpotifyFile(f)));

    setFiles((prev) =>
      prev.map((entry) => {
        const idx = entries.findIndex((e) => e.id === entry.id);
        if (idx === -1) return entry;
        return { ...entry, result: results[idx], processing: false };
      })
    );
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 0) {
        void processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      void processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => setFiles([]);

  const validCount = files.filter((f) => f.result?.valid).length;
  const errorCount = files.filter((f) => f.result && !f.result.valid).length;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/metricas"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Métricas
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Importar desde Spotify</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Spotify for Creators</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Importa tus exportaciones de Spotify para actualizar el historial de métricas de AMTME.
        </p>
      </div>

      {/* Zona de subida */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors p-8 text-center mb-4 ${
          dragging
            ? 'border-[#e8ff40] bg-[#e8ff40]/10'
            : 'border-border bg-muted/20 hover:border-muted-foreground/40'
        }`}
      >
        <input
          type="file"
          accept={ACCEPTED}
          multiple
          onChange={handleInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Subir archivos de Spotify"
        />
        <UploadSimple size={32} className="mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">Subir archivos de Spotify for Creators</p>
        <p className="text-xs text-muted-foreground mb-3">
          Sube los archivos exportados desde Analytics → Exportar datos → Descargar
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['CSV', 'XLSX', 'JSON', 'ZIP'].map((ext) => (
            <span
              key={ext}
              className="inline-block rounded border border-border bg-background px-2 py-0.5 text-xs font-mono text-muted-foreground"
            >
              {ext}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          En Spotify for Creators: Analytics → Exportar datos → Descargar
        </p>
      </div>

      {/* Acciones globales */}
      {files.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            {validCount > 0 && (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle size={14} />
                {validCount} válido{validCount !== 1 ? 's' : ''}
              </span>
            )}
            {errorCount > 0 && (
              <span className="flex items-center gap-1 text-red-500 font-medium">
                <XCircle size={14} />
                {errorCount} con error{errorCount !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* Lista de archivos */}
      <div className="space-y-3">
        {files.map((file) => (
          <FileCard key={file.id} file={file} onRemove={() => removeFile(file.id)} />
        ))}
      </div>

      {/* Instrucciones */}
      {files.length === 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-3">Cómo exportar desde Spotify for Creators</h2>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>
              Abre <span className="font-medium text-foreground">Spotify for Creators</span> en el
              navegador
            </li>
            <li>
              Ve a <span className="font-medium text-foreground">Analytics</span>
            </li>
            <li>
              Haz clic en <span className="font-medium text-foreground">Exportar datos</span>
            </li>
            <li>Selecciona el rango de fechas y descarga el archivo CSV</li>
            <li>Sube el archivo aquí</li>
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            Formatos compatibles: CSV (recomendado), JSON. Para XLSX y ZIP, convierte a CSV primero.
          </p>
        </div>
      )}
    </div>
  );
}

function FileCard({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  const { result, processing, name } = file;

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        processing
          ? 'border-border bg-muted/20'
          : result?.valid
            ? 'border-green-200 bg-green-50/50'
            : 'border-red-200 bg-red-50/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <FileText
            size={20}
            className={`mt-0.5 shrink-0 ${
              processing
                ? 'text-muted-foreground'
                : result?.valid
                  ? 'text-green-600'
                  : 'text-red-500'
            }`}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>

            {processing && <p className="text-xs text-muted-foreground mt-0.5">Procesando...</p>}

            {!processing && result?.valid && (
              <div className="mt-1.5 space-y-0.5">
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                  <span>
                    Formato: <span className="text-foreground font-medium">{result.format}</span>
                  </span>
                  <span>
                    Filas: <span className="text-foreground font-medium">{result.rowCount}</span>
                  </span>
                  <span>
                    Tipo: <span className="text-foreground font-medium">{result.reportLabel}</span>
                  </span>
                </div>
                {(result.periodStart || result.periodEnd) && (
                  <p className="text-xs text-muted-foreground">
                    Periodo:{' '}
                    <span className="text-foreground font-medium">
                      {result.periodStart ?? '—'} → {result.periodEnd ?? '—'}
                    </span>
                  </p>
                )}
              </div>
            )}

            {!processing && result && !result.valid && (
              <p className="text-xs text-red-600 mt-1">
                {result.error ?? 'Error al procesar el archivo'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!processing && result?.valid && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <CheckCircle size={12} />
              Válido
            </span>
          )}
          {!processing && result && !result.valid && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
              <XCircle size={12} />
              Error
            </span>
          )}
          <button
            onClick={onRemove}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Quitar archivo"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
