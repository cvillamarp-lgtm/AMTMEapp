'use client';

import { useState } from 'react';

const TOPICS = [
  'Amor vs apego',
  'Límites',
  'Dignidad',
  'Rechazo',
  'Duelo',
  'Ansiedad emocional',
  'Rol del salvador',
  'Volver a uno mismo',
  'Tarot como espejo',
];

export function EditorialTopicsGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
              style={{ color: '#687680' }}
            >
              <span
                className="h-px w-8"
                style={{ backgroundColor: 'rgba(12, 31, 54, 0.3)' }}
              ></span>
              Temas
            </div>
            <h2 className="mt-5 font-bold text-4xl lg:text-6xl">Lo que abordamos.</h2>
          </div>
          <span className="text-sm" style={{ color: '#687680' }}>
            09 territorios emocionales
          </span>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {TOPICS.map((tema, i) => (
            <button
              key={i}
              type="button"
              className="rounded-full border bg-white px-6 py-3 text-sm font-medium transition-colors hover:text-white"
              style={{
                borderColor: 'rgba(12, 31, 54, 0.2)',
                color: hoveredIndex === i ? '#f5f2ea' : '#0c1f36',
                backgroundColor: hoveredIndex === i ? '#0c1f36' : 'white',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span style={{ color: '#687680' }} className="mr-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              {tema}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
