import { initialStudioState } from '@/lib/studio-data';
import { buildVerificationReport, runStudioVerification } from '@/lib/studio-verifier';
import type { StudioState } from '@/lib/studio-types';

function cloneState(): StudioState {
  return JSON.parse(JSON.stringify(initialStudioState)) as StudioState;
}

describe('studio-verifier', () => {
  it('mantiene operativo el estado inicial de referencia', () => {
    const summary = runStudioVerification(cloneState());

    expect(summary.totalChecks).toBeGreaterThan(0);
    expect(summary.passedChecks).toBe(summary.totalChecks);
    expect(summary.score).toBe(100);
    expect(summary.issues).toEqual([]);

    const report = buildVerificationReport(summary);
    expect(report).toContain('Sin incidencias críticas. El sistema está operativo.');
  });

  it('detecta incidencias críticas y las detalla en el reporte', () => {
    const state = cloneState();

    state.episodes[0].cta = '';
    state.episodes[0].spotifyDescription = '';
    state.episodes[0].appleDescription = '';
    state.episodes[1].title = state.episodes[0].title;
    state.contentPieces[0].metricGoal = '';
    state.visualAssets[0].palette = 'Magenta vibrante';
    state.calendarEvents[0].date = '';
    state.checklists[0].items = [];
    state.masterSections = state.masterSections.filter(
      (section) => section.title !== 'Política operativa'
    );

    const summary = runStudioVerification(state);
    const titles = summary.issues.map((issue) => issue.title);

    expect(summary.score).toBeLessThan(100);
    expect(titles).toEqual(
      expect.arrayContaining([
        'Episodio publicado sin CTA',
        'Descripción Spotify faltante',
        'Descripción Apple Podcasts faltante',
        'Posible título duplicado',
        'Pieza sin meta de medición',
        'Activo visual sin paleta oficial',
        'Evento sin fecha',
        'Checklist vacío',
        'Falta política operativa en fuente central',
      ])
    );

    const report = buildVerificationReport(summary);
    expect(report).toContain('## Incidencias detectadas');
    expect(report).toContain('### Episodio publicado sin CTA');
    expect(report).toContain('### Falta política operativa en fuente central');
  });
});
