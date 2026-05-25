import { z } from 'zod';

export const HighlightStyleSchema = z.enum(['bar', 'color', 'bar+bold']);

export type HighlightStyle = z.infer<typeof HighlightStyleSchema>;

export type HighlightConfig = {
  text: string;
  style: HighlightStyle;
};

export function escapeXml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function normalizeText(input: string, fallback: string): string {
  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export function splitLines(input: string, maxLength = 48): string[] {
  const words = normalizeText(input, '').split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current.length === 0 ? word : `${current} ${word}`;
    if (next.length <= maxLength) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines;
}

export function renderCenteredTextBlock(input: {
  text: string;
  x: number;
  y: number;
  maxLength?: number;
  lineHeight?: number;
  className?: string;
}): string {
  const lines = splitLines(input.text, input.maxLength ?? 44);

  return lines
    .map((line, index) => {
      const y = input.y + index * (input.lineHeight ?? 46);
      const text = escapeXml(line);
      return `<text x="${input.x}" y="${y}" text-anchor="middle" class="${input.className ?? 'headline'}">${text}</text>`;
    })
    .join('');
}

export function applyHighlight(text: string, highlight?: HighlightConfig): string {
  if (!highlight) {
    return escapeXml(text);
  }

  const source = normalizeText(text, '');
  const target = normalizeText(highlight.text, '');
  if (!target) {
    return escapeXml(source);
  }

  const index = source.toLowerCase().indexOf(target.toLowerCase());
  if (index === -1) {
    return escapeXml(source);
  }

  const before = escapeXml(source.slice(0, index));
  const match = escapeXml(source.slice(index, index + target.length));
  const after = escapeXml(source.slice(index + target.length));

  const styleClass =
    highlight.style === 'bar'
      ? 'hl-bar'
      : highlight.style === 'bar+bold'
        ? 'hl-bar-bold'
        : 'hl-color';

  return `${before}<tspan class="${styleClass}">${match}</tspan>${after}`;
}
