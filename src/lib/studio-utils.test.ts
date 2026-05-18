import { formatDate, joinClasses } from '@/lib/studio-utils';

describe('studio-utils', () => {
  it('une clases descartando valores falsy', () => {
    expect(joinClasses('base', false, undefined, 'accent')).toBe('base accent');
  });

  it('formatea fechas válidas y conserva entradas inválidas', () => {
    expect(formatDate('')).toBe('Sin fecha');
    expect(formatDate('fecha-invalida')).toBe('fecha-invalida');

    const formatted = formatDate('2026-05-18');
    expect(formatted).toContain('2026');
    expect(formatted).not.toBe('2026-05-18');
  });
});
