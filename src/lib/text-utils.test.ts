import { clampFontSize, lineClampClass, truncateText, willTruncate } from '@/lib/text-utils';

describe('text-utils', () => {
  it('trunca texto y agrega puntos suspensivos sin exceder maxLength', () => {
    expect(truncateText('1234567890', 7)).toBe('1234...');
  });

  it('no trunca cuando el texto normalizado no excede maxLength', () => {
    expect(truncateText('  texto   breve  ', 11)).toBe('texto breve');
  });

  it('normaliza espacios múltiples antes de truncar', () => {
    expect(truncateText('hola\t\tmundo \n\n desde  AMTME', 15)).toBe('hola mundo d...');
  });

  it('evalúa willTruncate sobre texto normalizado', () => {
    expect(willTruncate('hola   mundo', 9)).toBe(true);
    expect(willTruncate('hola   mundo', 10)).toBe(false);
  });

  it('no trunca cuando longitud normalizada es igual a maxLength', () => {
    expect(willTruncate('hola mundo', 10)).toBe(false);
  });

  it('devuelve line-clamp correcto para 1..4 líneas', () => {
    expect(lineClampClass(1)).toBe('line-clamp-1');
    expect(lineClampClass(2)).toBe('line-clamp-2');
    expect(lineClampClass(3)).toBe('line-clamp-3');
    expect(lineClampClass(4)).toBe('line-clamp-4');
  });

  it('ajusta clampFontSize a mínimo y máximo', () => {
    expect(clampFontSize(8, 10, 18)).toBe(10);
    expect(clampFontSize(14, 10, 18)).toBe(14);
    expect(clampFontSize(22, 10, 18)).toBe(18);
  });

  it('lanza error si min es mayor que max', () => {
    expect(() => clampFontSize(12, 20, 10)).toThrow('min must be less than or equal to max');
  });

  it('lanza error si maxLength es menor o igual a 0', () => {
    expect(() => truncateText('texto', 0)).toThrow('maxLength must be greater than 0');
  });
});
