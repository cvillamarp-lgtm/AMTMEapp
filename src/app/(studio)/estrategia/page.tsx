'use client';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/shadcn/card';
import { CheckSquare, Square, Calendar, Users } from 'lucide-react';

export default function EstrategiaPage() {
  const [checked, setChecked] = useState<number[]>([]);
  function toggleCheck(i: number) {
    setChecked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-20 md:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold">Estrategia de Visibilidad 2026</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Plan de crecimiento organico para Christian Villamar
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Resenas meta', value: '300+', from: 'desde 26' },
          { label: 'Escuchas/mes', value: '35K+', from: 'desde 10K' },
          { label: 'Seguidores', value: '+500', from: 'nuevos' },
          { label: 'Posicion Latam', value: 'Top 25', from: 'duelo/ruptura' },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-2xl text-[#0c1f36]">{kpi.value}</CardTitle>
              <p className="text-xs text-muted-foreground">{kpi.from}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card className="mb-6 border-[#e8ff40] border-2">
        <CardHeader>
          <CardTitle className="text-base">Formula Ganadora de Titulos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm bg-[#0c1f36] text-[#e8ff40] p-3 rounded-lg">
            [Keyword] + [Beneficio] + [Gancho Emocional] max 70 caracteres
          </p>
          <div className="mt-4 space-y-2">
            {[
              'Duelo Amoroso: Por Que tu Cuerpo Duele Fisicamente Despues de una Ruptura',
              'Como Soltar a Alguien que Ya No te Elige (Sin Destruirte en el Intento)',
              'Relaciones Toxicas: 7 Senales que Ignoramos por Miedo a Quedarnos Solos',
              'El Duelo Silencioso: Cuando la Relacion Termina pero Nadie lo Sabe',
              'Amor Propio Despues de una Ruptura: El Proceso que Nadie te Ensena',
            ].map((t, i) => (
              <div key={i} className="text-sm p-2 bg-muted rounded flex justify-between gap-2">
                <span>{t}</span>
                <span className="text-xs text-muted-foreground shrink-0">{t.length}c</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Plan 6 Semanas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                week: 1,
                title: 'Duelo Amoroso: Por Que tu Cuerpo Siente Dolor Real',
                clip: 'Tu cuerpo hace duelo antes que tu mente',
                keyword: 'duelo amoroso',
              },
              {
                week: 2,
                title: 'Como Soltar a Alguien que Ya No te Elige (3 Cartas)',
                clip: 'La tecnica para soltar en 21 dias',
                keyword: 'como soltar a alguien',
              },
              {
                week: 3,
                title: 'Relaciones Toxicas: 5 Senales que Confundimos con Pasion',
                clip: 'Esto NO es amor, es trauma bonding',
                keyword: 'relaciones toxicas',
              },
              {
                week: 4,
                title: 'El Duelo Silencioso: Cuando la Relacion se Apaga',
                clip: 'Estas en una relacion fantasma?',
                keyword: 'duelo silencioso',
              },
              {
                week: 5,
                title: 'Amor Propio Despues de una Ruptura: Ritual 30 Mananas',
                clip: 'El ejercicio que cambio como me veo',
                keyword: 'amor propio ruptura',
              },
              {
                week: 6,
                title: 'Por Que Volvemos con Quien nos Hizo Dano',
                clip: 'El ciclo que 80% repite',
                keyword: 'apego ansioso',
              },
            ].map((w) => (
              <div key={w.week} className="border rounded-lg p-3 flex items-start gap-3">
                <span className="bg-[#0c1f36] text-[#e8ff40] text-xs font-bold px-2 py-1 rounded shrink-0">
                  S{w.week}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{w.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">Clip: {w.clip}</p>
                  <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    {w.keyword}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            CTAs que Funcionan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              label: 'Resenas',
              text: 'Si este episodio te ayudo aunque sea un 1%, por favor dejame una resena de 5 estrellas.',
            },
            {
              label: 'Guarda',
              text: 'Guarda este audio. Te va a servir en 3 semanas cuando lo necesites de nuevo.',
            },
            {
              label: 'Activa comentarios',
              text: 'Comenta DUELO si quieres que haga una serie completa sobre como sanar el cuerpo despues de una ruptura.',
            },
            {
              label: 'Comparte',
              text: 'Si conoces a alguien que esta pasando por esto ahora mismo, reenviale este episodio.',
            },
          ].map((cta, i) => (
            <div key={i}>
              <p className="text-xs font-semibold text-muted-foreground mb-1">{cta.label}</p>
              <p className="text-sm bg-muted p-3 rounded-lg">{cta.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Checklist 14 Dias</CardTitle>
          <CardDescription>{checked.length}/9 completadas</CardDescription>
          <div className="h-1.5 bg-muted rounded-full mt-2">
            <div
              className="h-1.5 bg-[#e8ff40] rounded-full transition-all"
              style={{ width: `${(checked.length / 9) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              {
                day: 'Dia 1-2',
                task: 'Re-optimizar titulos y descripciones de los 4 episodios mas recientes con la formula',
              },
              { day: 'Dia 3', task: 'Grabar 12 clips de 30 seg de episodios existentes en CapCut' },
              { day: 'Dia 4', task: 'Publicar 2 Reels/TikToks con clips viejos + CTA de resena' },
              {
                day: 'Dia 5-6',
                task: 'Responder todas las resenas actuales + pedir resena en stories',
              },
              { day: 'Dia 7', task: 'Publicar Episodio Semana 1 (miercoles 8am hora Mexico)' },
              { day: 'Dia 8-9', task: 'Subir episodio completo a YouTube con subtitulos' },
              {
                day: 'Dia 10-11',
                task: '3 Reels/TikToks del nuevo episodio con keywords del plan',
              },
              { day: 'Dia 12', task: 'Hilo en Threads/X con 5 citas del episodio + pregunta' },
              { day: 'Dia 13-14', task: 'Analizar metricas + ajustar estrategia para Semana 2' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="flex items-start gap-3 w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {checked.includes(i) ? (
                  <CheckSquare className="h-4 w-4 text-[#0c1f36] shrink-0 mt-0.5" />
                ) : (
                  <Square className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs font-semibold text-[#0c1f36]">{item.day}: </span>
                  <span
                    className={`text-sm ${checked.includes(i) ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {item.task}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
