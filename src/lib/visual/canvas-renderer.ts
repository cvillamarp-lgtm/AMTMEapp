import { z } from 'zod';

export const VisualRenderInputSchema = z.object({
  svg: z.string().min(20),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  format: z.enum(['svg', 'png']),
});

export type VisualRenderInput = z.infer<typeof VisualRenderInputSchema>;

export type VisualRenderOutput = {
  mimeType: 'image/svg+xml' | 'image/png';
  content: string;
  width: number;
  height: number;
};

export function renderVisualAsset(input: VisualRenderInput): VisualRenderOutput {
  const validated = VisualRenderInputSchema.parse(input);
  const mimeType = validated.format === 'svg' ? 'image/svg+xml' : 'image/png';

  if (validated.format === 'svg') {
    return {
      mimeType,
      content: validated.svg,
      width: validated.width,
      height: validated.height,
    };
  }

  const encoded = Buffer.from(validated.svg, 'utf8').toString('base64');
  return {
    mimeType,
    content: `data:image/svg+xml;base64,${encoded}`,
    width: validated.width,
    height: validated.height,
  };
}
