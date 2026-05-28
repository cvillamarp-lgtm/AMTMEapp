function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function truncateText(value: string, maxLength: number): string {
  if (maxLength <= 0) {
    throw new Error('maxLength must be greater than 0');
  }

  const normalized = normalizeWhitespace(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  if (maxLength <= 3) {
    return '...'.slice(0, maxLength);
  }

  return `${normalized.slice(0, maxLength - 3)}...`;
}

export function willTruncate(value: string, maxLength: number): boolean {
  return normalizeWhitespace(value).length > maxLength;
}

export function lineClampClass(lines: 1 | 2 | 3 | 4): string {
  return `line-clamp-${lines}`;
}

export function clampFontSize(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}
